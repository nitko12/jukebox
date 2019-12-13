document.getElementById("preporuke").innerHTML = "c";
document.getElementById("red").innerHTML = "c";

const recs = io("/recs");

function refreshRecs(data) {
    let str = "";
    data.sort((a, b) => parseInt(b.date) - parseInt(a.date));
    for (let i of data) {
        str += `<iframe src="https://www.youtube-nocookie.com/embed/${i.url}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen id="trend1"></iframe>`;
        str += ` submitted by: ${i.username} on ${moment(new Date(parseInt(i.date))).format('MM/DD/YYYY h:mm a')}`;
        str += `<button onclick="approveRec('${i.id}')">Approve</button><button onclick="deleteRec('${i.id}')">Delete</button>`
    }
    document.getElementById("preporuke").innerHTML = str;
}

function approveRec(id) {
    console.log(id)
    recs.emit("approve", id);
}

function deleteRec(id) {
    console.log(id)
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
        str += ` and has ${i.votes} votes<button onclick="deleteQueue('${i.id}')">Delete</button><hr>`
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