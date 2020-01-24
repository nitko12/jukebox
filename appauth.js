const uuid = require("uuid/v4");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const consts = require("./consts.js");
const safeCompare = require("safe-compare");

module.exports = function(app, passport, session, sessionStore, db) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      if (
        safeCompare(username, consts.admin.username) &&
        safeCompare(password, consts.admin.password)
      ) {
        return done(null, consts.admin);
      }
      if (
        safeCompare(username, consts.superuser.username) &&
        safeCompare(password, consts.superuser.password)
      ) {
        return done(null, consts.superuser);
      }
      db.user.findByArgs(
        { username: username, password: password },
        (err, row) => {
          if (err) return console.log(err);
          if (row) {
            return done(null, row);
          } else {
            return done(null, false);
          }
        }
      );
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    if (id === consts.admin.id) return done(null, consts.admin);
    if (id === consts.superuser.id) return done(null, consts.superuser);
    db.user.findById(id, (err, row) => {
      done(null, row);
    });
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    session({
      genid: req => {
        return uuid();
      },
      store: sessionStore,
      key: consts.sessionKey,
      secret: consts.sessionSecret,
      resave: false,
      saveUninitialized: true
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
