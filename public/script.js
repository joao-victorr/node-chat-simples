


let socket = io();

let User = {
    id: "",
    name: "",
    email: ""
}

let userList = "";

let loginPage = document.querySelector("#loginPage");
let chatPage = document.querySelector("#chatPage");

loginPage.style.display = "flex";
chatPage.style.display = "none";
document.getElementById('email').focus();



function renderUserList() {
    let ul = document.querySelector(".userList")
    ul.innerHTML = "";

    userList.forEach(e => {
        if(e === User.name) {
            ul.innerHTML += `<li class="me"> ${e} <span>You</li>`;
        } else {
            ul.innerHTML += `<li> ${e} </li>`;
        }
    });

}

function addMessage(type, user, msg) {
    let ul = document.querySelector(".chatList")
    
    switch (type) {
        case "status":
            ul.innerHTML += `<li class="m-status">${msg}</li>`;
            break;
        case "msg":

            if(user === User.name) {
                ul.innerHTML += `<li class="m-txt"><span class="me">${user}</span> ${msg}`;
            } else {
                ul.innerHTML += `<li class="m-txt"><span>${user}</span> ${msg}`;
            }
    
        default:
            break;
    }
}



document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const url = 'http://localhost:10000/login';

    const userData = {
        email,
        password
    }

    await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.id) {
            User.id = data.id;
            User.name = data.name;

            document.getElementById('email').value = "";
            document.getElementById('password').value = "";

            document.title = `Chat (${User.name})`;
            

            socket.emit('join-request', User);


        } else {
            password = "";
            alert(`Err: status: ${data.status} - message: ${data.err}`);
            
        }
    })
});



socket.on('user-ok', (list) => {
    loginPage.style.display = "none";
    chatPage.style.display = "flex";
    document.querySelector("#chatTextInput").focus();

    addMessage("status", null, "Conectado!");

    userList = list
    renderUserList();
})

socket.on('list-update', (data) => {

    if(data.joined) {
        addMessage("status", null, `${data.joined} Entrou no chat`)
    }

    if(data.left) {
        addMessage("status", null, `${data.left} Saiu do chat`)
    }

    userList = data.list
    renderUserList(userList)
})


document.querySelector("#chatTextInput").addEventListener("keyup", (e) => {

    if(e.keyCode === 13) {
        let txt = document.getElementById("chatTextInput").value.trim();

        if(txt != "") {
            addMessage("msg", User.name, txt)
            document.getElementById("chatTextInput").value = "";

            socket.emit("send-message", txt)
        }
    }
});

socket.on("show-message", (data) => {
    addMessage("msg", data.userMessage, data.msgNew)
})