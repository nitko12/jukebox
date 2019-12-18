const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const wavplayer = require("node-wav-player");

const consts = require("./consts.js");

module.exports = function(db, onplay) {
    class Player {
        constructor() {
            this.command = null;
            this.yt = null;
        }
        async play(num) {
            db.queue.getAll((err, data) => {
                if (err) return console.log(err);
                num %= data.length;
                data.sort((a, b) => b.votes - a.votes);
                if (data.length == 0) return;
                let t = data[num].url;
                console.log("Downloading: ", t);
                onplay(data[num].id);
                this.yt = ytdl(`https://www.youtube.com/watch?v=${t}`);
                this.command = ffmpeg(this.yt)
                    .output("./temp/temp.wav")
                    .noVideo()
                    .format("wav")
                    .outputOptions("-ar", "44100")
                    .on("end", () => {
                        this.command = null;
                        this.yt = null;
                        wavplayer
                            .play({
                                path: "./temp/temp.wav",
                                sync: true
                            })
                            .then(
                                () => {
                                    console.log("The wav file played successfully.");
                                    fs.unlink("./temp/temp.wav", err => {
                                        if (err) console.log(err);
                                    });
                                    this.play(num + 1);
                                },
                                err => {
                                    console.log(err);
                                }
                            )
                            .catch(error => {
                                console.error(error);
                            });
                    })
                    .run();
            });
            return;
        }

        stop() {
            console.log("Stopping..");
            if (this.command) this.command.kill();
            if (this.yt) this.yt.destroy();

            fs.unlink("./temp/temp.wav", err => {
                if (err) console.log(err);
            });
        }

        //isplaying() {
        //    return null != wavplayer._proc;
        //}
    }

    return new Player();
};