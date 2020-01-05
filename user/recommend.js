const recs = io("/recs");

function submit() {
  document.getElementById("status").innerHTML = "Obrađuje se...";
  recs.emit("add", document.getElementById("link").value, data => {
    if (data.accepted)
      document.getElementById("status").innerHTML =
        "Prihvaćeno, čeka odobrenje admina...";
    else
      document.getElementById("status").innerHTML =
        "Odbijeno, provjerite upisani link ili pokušajte ponovo kasnije...";
  });
}
