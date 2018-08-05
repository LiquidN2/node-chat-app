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

    socket.on('disconnect', () => {
        console.log('Client disconnect');
    })
});


server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
