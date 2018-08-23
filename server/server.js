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
        params.name = params.name.trim();

        if (params.activeroom !== '') {
            params.room = params.activeroom;
        } else {
            params.room = params.room.trim();
        }

        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('User name and room name are required!');
        }

        if(users.isExisting(params.name, params.room)) {
            return callback('This name has been used for this room. Please use a different name or try a different room');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // emit to new connection
        socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app - room ${params.room}`));

        // emit to all but the new connection
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback('This is from the server');
    });
    
    socket.on('createLocationMessage', coords => {
        const user = users.getUser(socket.id);

        if (user && coords) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.emit('updateActiveRooms', users.getRoomList());
    
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
