const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');


const app = express();
const server =http.createServer(app);
const io = socketIO(server);

dotenv.config();

server.listen(process.env.PORT);

app.use(express.static(path.join(__dirname, 'public')));

let connectedUser = [];

io.on('connection', (socket) => {
    console.log("conecção detectada")

    socket.on('join-request', (User) => {
        socket.userName = User.name;
        connectedUser.push(User.name);
        console.log(connectedUser)

        socket.emit('user-ok',  connectedUser);

        socket.broadcast.emit('list-update', {
            joined: User.name,
            list: connectedUser
        });
    });

    socket.on('disconnect', () => {
        connectedUser = connectedUser.filter(u => u != socket.userName);

        socket.broadcast.emit('list-update', {
            left: socket.userName,
            list: connectedUser
        });
    });

    socket.on('send-message', (msg) => {
        
        socket.broadcast.emit('show-message', {
            
            userMessage: socket.userName,
            msgNew: msg

        });
    });


})
