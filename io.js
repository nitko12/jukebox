const consts = require("./consts.js");
const tester = require("./link-tester.js");

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
            if (
                socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.recs.getAll((err, data) => {
                if (err) return console.log(err);
                return fn(data);
            });
        });
        socket.on("add", (link, fn) => {
            if (!socket.request.user.logged_in ||
                socket.request.user.username == consts.admin.username
            )
                return fn("lol no");
            let q;
            if (link.indexOf("?v=") != -1)
                q = link.substr(link.indexOf("?v=") + 3, 11);
            else if (link.indexOf("youtu.be/") != -1)
                q = link.substr(link.indexOf("youtu.be/") + 8, 11);
            else
                fn({ accepted: false });
            console.log(socket.request.user);
            db.user.lastRecommend(socket.request.user.id, (err, data) => {
                if (data == "never" || new Date().getTime() - new Date(parseInt(data)).getTime() >= consts.recCooldown) {
                    tester(q, db, (err, data) => {
                        if (err)
                            return fn({ accepted: false });
                        db.recs.add(socket.request.user.id, q, new Date().getTime(), (err, data) => {
                            if (err) {
                                console.log(err);
                                return fn({ accepted: false });
                            }
                            db.recs.getAll((err, data) => {
                                if (err)
                                    console.log(err);
                                io.of("/recs").emit("refresh", data);
                            });
                            fn({ accepted: true });
                        })

                    });
                } else {
                    return fn({ accepted: false });
                }
            });
        });

        socket.on("approve", id => {
            if (socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.recs.get(id, (err, data) => {
                if (err)
                    return console.log(err);
                if (!data)
                    return console.log("Error while approving...");
                db.queue.push(data.url, data.username, err => {
                    if (err)
                        return console.log(err);
                    db.recs.remove(id, err => {
                        if (err)
                            console.log(err);
                        db.recs.getAll((err, data) => {
                            if (err)
                                console.log(err);
                            io.of("/recs").emit("refresh", data);
                            db.queue.getAll((err, data) => {
                                if (err)
                                    return console.log(err);
                                io.of("/queue").emit("refresh", data);
                            });
                        });
                    });
                });

            })
        });

        socket.on("delete", id => {
            if (socket.request.user.username != consts.admin.username ||
                socket.request.user.password != consts.admin.password
            )
                return fn("lol no");
            db.recs.remove(id, err => {
                if (err)
                    console.log(err);
                db.recs.getAll((err, data) => {
                    if (err)
                        console.log(err);
                    io.of("/recs").emit("refresh", data);
                });
            });
        });
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
        socket.on("get", (data, fn) => {
            db.queue.getAll((err, data) => {
                if (err)
                    return console.log(err);
                fn(data);
            });
        });

        socket.on("delete", (id, fn) => {
            if (!id)
                return fn(true);
            db.queue.remove(id, (err) => {
                if (err)
                    console.log(err)
                db.queue.getAll((err, data) => {
                    if (err)
                        return console.log(err);
                    io.of("/queue").emit("refresh", data);
                });
            });
        });
    });

    io.of("/publicqueue").on("connection", socket => {
        socket.on("get", (data, fn) => {
            db.queue.getAll((err, data) => {
                if (err)
                    return console.log(err);
                data.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
                fn(data.splice(0, 5));
            });
        });
    });
};