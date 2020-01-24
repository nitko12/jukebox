document.getElementById("preporuke").innerHTML = "Učitavanje...";
document.getElementById("red").innerHTML = "Učitavanje...";

const recs = io("/recs");

function refreshRecs(data) {
  data.sort((a, b) => parseInt(a.date) - parseInt(b.date));
  document.getElementById("preporuke").innerHTML = "";
  Promise.all(
    data.map(u =>
      fetch(
        "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + u.url
      )
    )
  )
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(texts => {
      for (let i = 0; i < texts.length; ++i) {
        let str = `    
        <span style="cursor:default;">
          <a class="new_iframe_thumbnail" id="thumbnail_space" href="https://www.youtube.com/watch?v=${data[i].url}">
            <span class="thumbnail_naslov">
              <h1 class="naslov_video" id="naslov_videozapisa">${texts[i]["title"]}</h1>
              <div class="play_button"></div>
            </span>
            <img src="${texts[i]["thumbnail_url"]}" class="thumbnail_slika">
          </a>
        </span>`;
        str += ` <div> poslano od: ${data[i].username} u ${moment(
          new Date(parseInt(data[i].date))
        ).format("MM/DD/YYYY h:mm a")}`;
        str += `</div> <br> <button onclick="approveRec('${data[i].id}')">Odobri</button><button onclick="deleteRec('${i.id}')">Obriši</button><hr>`;
        document.getElementById("preporuke").innerHTML = str;
      }
    });
}

function approveRec(id) {
  recs.emit("approve", id);
}

function deleteRec(id) {
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
  data.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
  document.getElementById("red").innerHTML = "";
  Promise.all(
    data.map(u =>
      fetch(
        "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + u.url
      )
    )
  )
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(texts => {
      console.log(texts, data);
      for (let i = 0; i < texts.length; ++i) {
        let str = `    
          <span style="cursor:default;">
          <a class="new_iframe_thumbnail" id="thumbnail_space" href="#">
            <span class="thumbnail_naslov">
              <h1 class="naslov_video" id="naslov_videozapisa">${texts[i]["title"]}</h1>
              <div class="play_button"></div>
            </span>
            <img src="${texts[i]["thumbnail_url"]}" class="thumbnail_slika">
          </a>
        </span>`;
        str += ` <div> poslano od: ${data[i].submittedBy}`;
        str += ` i ima ${data[i].votes} votes </div><button onclick="deleteQueue('${data[i].id}')">Obriši</button><hr>`;
        document.getElementById("red").innerHTML += str;
      }
    });
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
    refreshUserText(data);
  });
  usertext.on("refresh", data => {
    refreshUserText(data);
  });
});

const dashboard = io("/dashboard");

let clock,
  delay = 0;

function f(a) {
  return (a < 10 ? "0" : "") + a;
}

dashboard.on("connect", function(socket) {
  dashboard.emit("getVolume", data => {
    document.getElementById("glasnoca").value = data;
    document.getElementById("glasnocaValue").innerHTML = data;
    document.getElementById("glasnocaValueM").innerHTML = data;
  });
  dashboard.on("time", data => {
    delay = new Date().getTime() - data;
    if (clock) clearInterval(clock);
    clock = setInterval(() => {
      let d = new Date(new Date().getTime() - delay);
      let s1 =
          f(d.getHours()) + ":" + f(d.getMinutes()) + ":" + f(d.getSeconds()),
        s2 = s1 + "<br>" + delay / 1000 + "s kasni";
      document.getElementById("server_vrijeme").innerHTML = s1;
      document.getElementById("server_vrijeme2").innerHTML = s2;
    }, 500);
  });
});

const usertext2 = io("/usertext2");

usertext2.on("connect", function(socket) {
  usertext2.emit("get", data => {
    document.getElementById("usertext2").value = data;
    console.log(document.getElementById("usertext2").innerHTML);
  });
  usertext2.on("refresh", data => {
    document.getElementById("usertext2").value = data;
  });
});

function updateText2() {
  let v = document.getElementById("usertext2").value;
  usertext2.emit("set", v);
}

function sliderChange() {
  let s = document.getElementById("glasnoca");
  document.getElementById("glasnocaValue").innerHTML = s.value;
  document.getElementById("glasnocaValueM").innerHTML = s.value;

  dashboard.emit("setVolume", s.value);
}
