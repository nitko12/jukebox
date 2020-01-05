document.getElementById("data").innerHTML = "Učitavanje...";

const queue = io("/queue");

async function refreshQueue(data) {
  data.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
  let str = "";
  let cnt = 1;
  data.forEach(el => {
    str += `<table class="trend-no1">
        <tr>
            <td class="trend-br1"><iframe src="https://www.youtube-nocookie.com/embed/${
              el.url
            }" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></td>
            <td class="trend-broj-1"><p class="trend-broj">#${cnt++}</p></td>
            <td class="naziv-pjesme"><h4 id="naziv-pjesme">Odabralo: ${
              el.votes
            }</h4></td>
                    <td class="trend-broj-${
                      el.votes
                    }"><p class="trend-broj"><i class="material-icons glasaj-icon" style="font-size:70px;" title="Daj glas ovoj pjesmi" id="glasaj" onclick="vote('${
      el.id
    }')">thumb_up</i></p></td>
        </tr>
    </table>`;

    //str += `<iframe src="https://www.youtube-nocookie.com/embed/${el.url}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    //str += ` Odabralo: ${el.votes} `;
    //str += `<button onclick="vote('${el.id}')">Glasaj</button>`;
    //str += `<hr>`;
  });
  document.getElementById("data").innerHTML = str;
}

function vote(id) {
  queue.emit("vote", id, data => {
    if (data.accepted) alert("Uspješno ste dali glas!");
    else alert("Pričekajte malo prije ponovnog glasovanja!");
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
