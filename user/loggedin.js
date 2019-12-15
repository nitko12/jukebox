document.getElementById("data").innerHTML = "a";

const queue = io("/queue");

async function refreshQueue(data) {
    data.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
    let str = "";
    data.forEach(el => {
        str += `<iframe src="https://www.youtube-nocookie.com/embed/${el.url}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        str += `Ima ${el.votes} glasova, `;
        str += `<button onclick="vote('${el.id}')">Glasaj</button>`;
        str += `<hr>`;
    });
    document.getElementById("data").innerHTML = str;
}

function vote(id) {
    queue.emit("vote", id, data => {
        if (data.accepted) alert("Success");
        else alert("Can't vote yet, wait a bit");
    });
}

queue.on("connect", function(socket) {
    queue.emit("get", null, data => {
        refreshQueue(data);
    });
    queue.on("refresh", data => {
        refreshQueue(data);
    });
});