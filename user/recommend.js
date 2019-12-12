const recs = io("/recs");

function submit() {
    recs.emit("add", document.getElementById("link").value, data => {
        console.log(data);
    });
}