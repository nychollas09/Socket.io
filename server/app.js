const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 4444;
const socketio = require('socket.io')(http);

socketio.on('connection', (socket) => {
    socket.on('eventMensagem', (mensagem) => {
        socketio.emit('eventMensagem', mensagem);
    });
});

http.listen(port, () => {
    console.log('Listen port 4444');
});