const consts = require("./consts.js");
module.exports = function(io, db) {
    io.on("connection", socket => {});

    io.of("/user").on("connection", socket => {
        socket.on("stepYear", fn => {
            if (
                socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.user.step((err, data) => {
                if (err) {
                    console.log(err);
                    return fn({ accepted: false });
                }
                console.log(data);
                fn({ accepted: true, data: data });
            });
        });
        socket.on("reqrefresh", fn => {
            if (
                socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.user.getAll((err, data) => {
                if (err) return console.log(err);
                fn(data);
            });
        });
        socket.on("set", (data, fn) => {
            if (
                socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.user.batch(data, err => {
                if (err) {
                    console.log("Error while parsing user additions");
                    return fn({ accepted: false });
                }
                fn({ accepted: true });
            });
        });
        socket.on("deletefromdb", (data, fn) => {
            if (
                socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.user.delete(data, (err, users) => {
                if (err) {
                    console.log("Error while parsing user deletions");
                    return fn({ accepted: false });
                }
                let userData = {};
                console.log(users);
                for (let i = 0; i < users.length; ++i)
                    userData[i.toString()] = users[i];
                fn({ accepted: true, data: users }, data);
            });
        });
    });

    io.of("/recs").on("connection", function(socket) {
        socket.on("get", (msg, fn) => {
            db.recs.getAll((err, data) => {
                if (err) return console.log(err);
                return fn(data);
            });
        });
        socket.on("app", data => {});
        socket.on("del", data => {});
    });

    io.of("/schedule").on("connection", socket => {
        socket.on("get", (msg, fn) => {
            if (
                socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.schedule.get((err, data) => {
                if (err) return console.log(err);
                fn(data);
            });
        });
        socket.on("set", (data, fn) => {
            if (
                socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.schedule.set(data.json, err => {
                if (err) {
                    console.log("Schedule set error: ", err);
                    fn({ accepted: false });
                }
                fn({ accepted: true });
            });
        });
    });

    io.of("/queue").on("connection", socket => {
        console.log("queue");
        socket.on("", data => {});
    });
};