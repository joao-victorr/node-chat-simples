const socket = io();

let userName = "";
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('chatTextInput');

function renderUserList() {
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(i => {
        ul.innerHTML += "<li>"+i+"</li>"
    });
}

loginPage.style.display = 'flex';
chatPage.style.display = 'none';
loginInput.focus();

loginInput.addEventListener('keyup', (e) => {

    if(e.keyCode === 13) {
        let name = loginInput.value.trim();
        if(name != "") {
            userName = name;
            document.title = `Chat (${userName})`;
            loginInput.value = '';
            socket.emit('join-request', userName);
        }
    }
});

socket.on('user-ok', (list) => {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    

    userList = list;
    renderUserList();
});

socket.on('list-update', (data) => {
    userList = data.list;
    renderUserList();
});