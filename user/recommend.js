const recs = io("/recs");

function submit() {
    document.getElementById("status").innerHTML = "Processing...";
    recs.emit("add", document.getElementById("link").value, data => {
        if (data.accepted)
            document.getElementById("status").innerHTML = "Accepted, waiting admin approval...";
        else
            document.getElementById("status").innerHTML = "Denied, try again a bit later...";
    });
}