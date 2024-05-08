
let socket = io();
const createAccount = document.querySelector('#createAccount');
const buttonLogin = document.getElementById('login-form')
const inputEmail = document.getElementById('email');
const inputName = document.getElementById('name');
const inputPassword = document.getElementById('password');
let loginPage = document.querySelector("#loginPage");
let chatPage = document.querySelector("#chatPage");


const logged = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if (user != null) {
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";
        document.title = `Chat (${user.name})`;
        socket.emit('join-request', user);
    }
}

logged()

createAccount.addEventListener('click', () => {
    document.getElementById('name').classList.toggle('hidden');
    document.querySelector('.title').classList.toggle('create');
    document.querySelector('.forgotPassword').classList.toggle('create');
    buttonLogin.classList.toggle('create');
    createAccount.classList.toggle('create');
    buttonLogin.value = buttonLogin.value == "1" ? "0" : "1"
})

  

let userList = "";



loginPage.style.display = "flex";
chatPage.style.display = "none";
document.getElementById('email').focus();




function renderUserList() {
    let ul = document.querySelector(".userList")
    ul.innerHTML = "";

    userList.forEach(e => {
        console.log(e);
        
        const user = JSON.parse(localStorage.getItem("user"));

        console.log(user)

        if(e === user.name) {
            ul.innerHTML += `<li class="me"> ${e} <span>You</li>`;
        } else {
            ul.innerHTML += `<li> ${e} </li>`;
        }
    });

}

function addMessage(type, userName, msg) {
    let ul = document.querySelector(".chatList")
    
    switch (type) {
        case "status":
            ul.innerHTML += `<li class="m-status">${msg}</li>`;
            break;
        case "msg":
            const user = JSON.parse(localStorage.getItem("user"))

            if(userName === user.name) {
                ul.innerHTML += `<li class="m-txt"><span class="me">${user.name}</span> ${msg}`;
            } else {
                ul.innerHTML += `<li class="m-txt"><span>${user.name}</span> ${msg}`;
            }
    
        default:
            break;
    }
}



buttonLogin.addEventListener('click', async () => {

    if (buttonLogin.value === "1") {
        const email = inputEmail.value;
        const password = inputPassword.value;
        const name = inputName.value;

        if(!email || !password || !name) {
            alert("Preencha todos os campos")
            return
        }

        const url = 'https://node-chat-simples.onrender.com/user';
        const data = {
            email,
            password,
            name
        }
        await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.email) {
                window.location.reload()
            }
        })
        
    }

    const email = inputEmail.value;
    const password = inputPassword.value;

    const url = 'https://node-chat-simples.onrender.com/login';

    const data = {
        email,
        password
    }

    await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.user && data.token) {

            localStorage.setItem('user', JSON.stringify(data.user));

            document.getElementById('email').value = "";
            document.getElementById('password').value = "";
            document.title = `Chat (${data.user.name})`;

            socket.emit('join-request', data.user);


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
    console.log(e)

    if(e.keyCode === 13) {
        let txt = document.getElementById("chatTextInput").value.trim();

        if(txt != "") {
            const user = JSON.parse(localStorage.getItem("user"))
            addMessage("msg", user.name, txt)
            document.getElementById("chatTextInput").value = "";

            socket.emit("send-message", txt)
        }
    }
});

socket.on("show-message", (data) => {
    addMessage("msg", data.userMessage, data.msgNew)
})