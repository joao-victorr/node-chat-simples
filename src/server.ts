import "express-async-errors";
import express, { ErrorRequestHandler, Request, Response, Express } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
import path from 'path';
import cors from 'cors';

import router from './router';
import { ErrorMiddleware } from "./middleware/ErrorsMiddleware";

const app: Express = express();

// Definindo o diretório para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para análise de URL codificada e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para habilitar o CORS
app.use(cors({
    origin: '*'
}));

app.use(router)

app.use(ErrorMiddleware)

// Criando o servidor HTTP com o Express
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor Express está ouvindo na porta ${process.env.PORT || 3000}`);
});

let connectedUser: Array<string> = []

interface CustomSocket extends Socket {
    userName?: string;
}
// Inicializando o Socket.IO no mesmo servidor Express
const io = new SocketIOServer(server);

// Configuração de eventos de Socket.IO
io.on('connection', (socket: CustomSocket) => {
    console.log('Um cliente se conectou ao servidor.');

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
});

// Configuração de rotas HTTP com o Express (opcional)
app.get('/', (req, res) => {
    res.send('Servidor Express funcionando!');
});
