const sch = io("/schedule");

sch.on("connect", function(socket) {
    sch.emit("get", null, data => {
        document.getElementById("main").value = data.json;
    });
});

function set(id) {
    document.getElementById("main").value = defaults[id];
}

function submit() {
    sch.emit("set", { json: document.getElementById("main").value }, data => {
        console.log(data);
        if (data.accepted) alert("Succesfully set");
        else alert("Something went wrong, check formatting");
    });
}

const defaults = [
    "mon:08:26-08:34;10:01-10:09;14:41-14:49;16:16-16:24;\n" + // skracen
    "tue:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "wed:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "thu:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "fri:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sat:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sun:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n",

    "mon:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "tue:08:26-08:34;10:01-10:09;14:41-14:49;16:16-16:24;\n" + // skracen
    "wed:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "thu:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "fri:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sat:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sun:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n",

    "mon:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "tue:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "wed:08:26-08:34;10:01-10:09;14:41-14:49;16:16-16:24;\n" + // skracen
    "thu:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "fri:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sat:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sun:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n",

    "mon:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "tue:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "wed:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "thu:08:26-08:34;10:01-10:09;14:41-14:49;16:16-16:24;\n" + // skracen
    "fri:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sat:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sun:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n",

    "mon:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "tue:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "wed:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "thu:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "fri:08:26-08:34;10:01-10:09;14:41-14:49;16:16-16:24;\n" + // skracen
    "sat:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n" +
    "sun:08:36-08:49;10:26-10:34;14:36-14:49;16:26-16:34;\n"
];