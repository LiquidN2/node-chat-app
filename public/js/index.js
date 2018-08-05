var socket = io(); // client makes a request to server to open a web socket and keeps that socket open
        
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function(message) {
    console.log(message);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});