const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

// app.get('/', (req, res) => {
//     res.send();
// });

io.on('connection', socket => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'john',
        text: 'Hello. How are you?',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', message => {
        message.createdAt = new Date().getTime();
        console.log(message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnect');
    })
});

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
