const changepass = io("/changepass")

function changePass() {
    changepass.emit("change", { lastpass: document.getElementById("lastpass").value, newpass: document.getElementById("newpass").value }, data => {
        if (data.accepted)
            alert("Success");
        else
            alert("Something went wrong")
    })
}