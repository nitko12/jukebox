const consts = require("./consts.js");
const db = require("./db.js");

const express = require("express");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

http.listen(consts.port, function() {
    console.log(`listening on: ${consts.port}`);
});

const passportSocketIo = require("passport.socketio");

const session = require("express-session");
const FileStore = require("session-file-store")(session);
const sessionStore = new FileStore();

const passport = require("passport");

require("./appauth.js")(app, passport, session, sessionStore, db);
require("./app.js")(express, app, passport);

require("./ioauth.js")(io, passportSocketIo, sessionStore);
require("./io.js")(io, db);

let onplay = id => {
    db.queue.half(id, err => {
        if (err) return console.log(err);
        db.queue.getAll((err, data) => {
            if (err) return console.log(err);
            io.of("/queue").emit("refresh", data);
            io.of("/publicqueue").emit("refresh", data);
        });
    });
};

const clock = require("./clock.js")(db, onplay);