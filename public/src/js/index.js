const socket = io(); // client makes a request to server to open a web socket and keeps that socket open

const messages = document.getElementById('messages');
const form = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const getMessage = () => messageInput.value;
const renderMessage = message => {
    const markup = `<li>${message.from}: ${message.text}</li>`;
    messages.insertAdjacentHTML('beforeend', markup);
};

socket.on('connect',() => console.log('Connected to server'));

socket.on('newMessage', message => {
    if(message) {
        renderMessage(message);
    }
});

form.addEventListener('submit', event => {
    event.preventDefault();
    // console.log('message sent');
    const message = getMessage();
    socket.emit('createMessage', {
        from: 'Hugh',
        text: message
    }, function(data) {
        console.log('Got it!', data);    
    })
});

socket.on('disconnect', () => console.log('Disconnected from server'));