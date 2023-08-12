const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server =http.createServer(app);
const io = socketIO(server);


server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

let connectedUser = [];

io.on('connection', (socket) => {

    socket.on('join-request', (userName) => {
        console.log("New connetion detect")
        socket.userName = userName;
        connectedUser.push(userName);
        console.log(connectedUser);

        socket.emit('user-ok', connectedUser);
        socket.broadcast.emit('list-update', {
            joined: userName,
            list: connectedUser
        });
    });

    socket.on('disconnect', () => {
        connectedUser = connectedUser.filter(u => u != socket.userName);
        console.log(connectedUser);

        socket.broadcast.emit('list-update', {
            left: socket.userName,
            list: connectedUser
        });
    });

    socket.on('send-msg', (txt) => {
        let obj = {
            userName: socket.userName,
            message: txt
        }
        socket.broadcast.emit('show-msg', obj);

    })

})