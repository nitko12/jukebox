document.getElementById("preporuke").innerHTML = "c";
document.getElementById("red").innerHTML = "c";

const recs = io("/recs");

recs.on("connect", function(socket) {
    recs.emit("get", null, data => {
        console.log(data);
    });
});