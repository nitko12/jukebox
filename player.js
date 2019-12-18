const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const wavplayer = require("node-wav-player");
const consts = require("./consts.js");

module.exports = function(db, onplay) {
    class Player {
        constructor() {}
        async play(num) {
            db.queue.getAll((err, data) => {
                if (err) return console.log(err);
                if (num >= data.length) return;
                data.sort((a, b) => b.votes - a.votes);
                let t = data[num].url;
                console.log("Downloading: ", t);
                onplay(data[num].id);
                ffmpeg(
                        ytdl(`https://www.youtube.com/watch?v=${t}`).on("error", err => {
                            console.log(err);
                        })
                    )
                    .output("./temp/temp.wav")
                    .noVideo()
                    .format("wav")
                    .outputOptions("-ar", "44100")
                    .on("end", () => {
                        wavplayer
                            .play({
                                path: "./temp/temp.wav",
                                sync: true
                            })
                            .then(() => {
                                console.log("The wav file played successfully.");
                                fs.unlink("./temp/temp.wav", err => {
                                    if (err) console.log(err);
                                });
                                this.play(num + 1);
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    })
                    .run();
            });
            return;
        }

        async stop() {
            console.log("Stopping..");
            if (!wavplayer) return;
            wavplayer.stop();
            fs.unlink("./temp/temp.wav", err => {
                if (err) console.log(err);
            });
        }
    }

    return new Player();
};