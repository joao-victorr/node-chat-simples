"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const ErrorsMiddleware_1 = require("./middleware/ErrorsMiddleware");
const app = (0, express_1.default)();
// Definindo o diretório para servir arquivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Middleware para análise de URL codificada e JSON
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Middleware para habilitar o CORS
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(router_1.default);
app.use(ErrorsMiddleware_1.ErrorMiddleware);
// Criando o servidor HTTP com o Express
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor Express está ouvindo na porta ${process.env.PORT || 3000}`);
});
let connectedUser = [];
// Inicializando o Socket.IO no mesmo servidor Express
const io = new socket_io_1.Server(server);
// Configuração de eventos de Socket.IO
io.on('connection', (socket) => {
    console.log('Um cliente se conectou ao servidor.');
    socket.on('join-request', (User) => {
        socket.userName = User.name;
        connectedUser.push(User.name);
        console.log(connectedUser);
        socket.emit('user-ok', connectedUser);
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
//# sourceMappingURL=server.js.map