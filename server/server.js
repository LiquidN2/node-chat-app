const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('User name and room name are required!');
        } 
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        //socket.leave(params.room);
        // io.emit -> io.to(params.room).emit
        // socket.broadcast.emit -> socket.broadcast.to(params.room).emit
        // socket.emit
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // emit to new connection
        socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app - room ${params.room}`));
        // emit to all but the new connection
        // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

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

    // when client disconnect with chat server 
    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left chat room`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
