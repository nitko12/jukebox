const consts = require("./consts.js");
module.exports = function(io, passportSocketIo, sessionStore) {
    io.origins("*:*");
    io.of("/usertext").use(
        passportSocketIo.authorize({
            cookieParser: require("cookie-parser"),
            key: consts.sessionKey,
            secret: consts.sessionSecret,
            store: sessionStore,
            success: onAuthorizeSuccess,
            fail: onAuthorizeFail
        })
    );

    io.of("/changepass").use(
        passportSocketIo.authorize({
            cookieParser: require("cookie-parser"),
            key: consts.sessionKey,
            secret: consts.sessionSecret,
            store: sessionStore,
            success: onAuthorizeSuccess,
            fail: onAuthorizeFail
        })
    );

    io.of("/queue").use(
        passportSocketIo.authorize({
            cookieParser: require("cookie-parser"),
            key: consts.sessionKey,
            secret: consts.sessionSecret,
            store: sessionStore,
            success: onAuthorizeSuccess,
            fail: onAuthorizeFail
        })
    );

    io.of("/schedule").use(
        passportSocketIo.authorize({
            cookieParser: require("cookie-parser"),
            key: consts.sessionKey,
            secret: consts.sessionSecret,
            store: sessionStore,
            success: onAuthorizeSuccess,
            fail: onAuthorizeFail
        })
    );

    io.of("/recs").use(
        passportSocketIo.authorize({
            cookieParser: require("cookie-parser"),
            key: consts.sessionKey,
            secret: consts.sessionSecret,
            store: sessionStore,
            success: onAuthorizeSuccess,
            fail: onAuthorizeFail
        })
    );

    io.of("/user").use(
        passportSocketIo.authorize({
            cookieParser: require("cookie-parser"),
            key: consts.sessionKey,
            secret: consts.sessionSecret,
            store: sessionStore,
            success: onAuthorizeSuccess,
            fail: onAuthorizeFail
        })
    );
};

function onAuthorizeSuccess(data, accept) {
    accept();
}

function onAuthorizeFail(data, message, error, accept) {
    if (error) accept(new Error(message));
}