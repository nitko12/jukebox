document.getElementById("preporuke").innerHTML = "Učitavanje...";
document.getElementById("red").innerHTML = "Učitavanje...";

const recs = io("/recs");

function refreshRecs(data) {
    let str = "";
    data.sort((a, b) => parseInt(a.date) - parseInt(b.date));
    for (let i of data) {
        str += `<iframe src="https://www.youtube-nocookie.com/embed/${i.url}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen id="trend1"></iframe>`;
        str += ` submitted by: ${i.username} on ${moment(
      new Date(parseInt(i.date))
    ).format("MM/DD/YYYY h:mm a")}`;
        str += `<br><button onclick="approveRec('${i.id}')">Approve</button><button onclick="deleteRec('${i.id}')">Delete</button><hr>`;
    }
    document.getElementById("preporuke").innerHTML = str;
}

function approveRec(id) {
    console.log(id);
    recs.emit("approve", id);
}

function deleteRec(id) {
    console.log(id);
    recs.emit("delete", id);
}

recs.on("connect", function(socket) {
    recs.emit("get", null, data => {
        refreshRecs(data);
    });
    recs.on("refresh", data => {
        refreshRecs(data);
    });
});

const queue = io("/queue");

function refreshQueue(data) {
    let str = "";
    data.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
    for (let i of data) {
        str += `<iframe src="https://www.youtube-nocookie.com/embed/${i.url}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen id="trend1"></iframe>`;
        str += ` submitted by: ${i.submittedBy}`;
        str += ` and has ${i.votes} votes<button onclick="deleteQueue('${i.id}')">Delete</button><hr>`;
    }
    document.getElementById("red").innerHTML = str;
}

function deleteQueue(id) {
    queue.emit("delete", id);
}

queue.on("connect", function(socket) {
    queue.emit("get", null, data => {
        refreshQueue(data);
    });
    queue.on("refresh", data => {
        refreshQueue(data);
    });
});

const usertext = io("/usertext");

function refreshUserText(data) {
    document.getElementById("usertext").value = data;
}

function updateText() {
    let v = document.getElementById("usertext").value;
    usertext.emit("set", v, data => {
        document.getElementById("usertext").value = data;
    });
}

usertext.on("connect", function(socket) {
    usertext.emit("get", null, data => {
        console.log(data)
        refreshUserText(data);
    });
    usertext.on("refresh", data => {
        refreshUserText(data);
    });
});