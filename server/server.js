const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    // emit to new connection
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // emit to all but the new connection
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        // message.createdAt = new Date().getTime();
        // console.log(message);

        // emit to all connected sockets
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');

        // emit to all but the socket sending the createMessage event
        // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
    });
    
    socket.on('createLocationMessage', coords => {
        // io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnect');
    });
});

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
