const { audio } = require("system-control");
// not tested
module.exports = function(loudness) {
  audio.volume(loudness);
};
