const queue = io("/publicqueue");

async function refreshQueue(data) {
    data.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${data[0].url}`);
    const json = await response.json();
    document.getElementById("naziv-pjesme").innerHTML = json["title"];
    for (let i = 1; i <= 5; ++i) {
        if (data[i - 1])
            document.getElementById(`trend${i}`).src = `https://www.youtube-nocookie.com/embed/${data[i - 1].url}`;
    }
}

queue.on("connect", function(socket) {
    queue.emit("get", null, data => {

        refreshQueue(data);
    });
    queue.on("refresh", data => {
        refreshQueue(data);
    });
});

var url = new URL(window.location.href);
var c = url.searchParams.get("login");
if (c == "0")
    alert("Prijava neuspjesna!");


document.getElementById("poruka-administratora").innerHTML = "Učitavanje...";

const usertext = io("/usertextpublic");

function refreshUserText(data) {
    document.getElementById("poruka-administratora").innerHTML = data;
}

usertext.on("connect", function(socket) {
    usertext.emit("get", null, data => {
        refreshUserText(data);
    });
    usertext.on("refresh", data => {
        refreshUserText(data);
    });
});