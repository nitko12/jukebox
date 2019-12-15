const consts = require("./consts.js");
const db = require("./db.js");

const express = require("express");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

http.listen(8080, function() {
    console.log("listening on *:8080");
});

const passportSocketIo = require("passport.socketio");

const session = require("express-session");
const FileStore = require("session-file-store")(session);
const sessionStore = new FileStore();

const passport = require("passport");

require("./appauth.js")(app, passport, session, sessionStore, db);
require("./app.js")(express, app, passport); // add all paths to app

require("./ioauth.js")(io, passportSocketIo, sessionStore);
require("./io.js")(io, db);

const clock = require("./clock.js")(db);