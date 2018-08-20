const socket = io(); // client makes a request to server to open a web socket and keeps that socket open

const messages = document.getElementById('messages');
const form = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const locationBtn = document.getElementById('send-location');

const clearInput = () => {
    messageInput.value = '';
};
const getMessage = () => messageInput.value;
const renderMessage = message => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const markup = `<li>${message.from} (${formattedTime}): ${message.text}</li>`;
    messages.insertAdjacentHTML('beforeend', markup);
};

const renderLocationMessage = message => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const markup = `<li>${message.from} (${formattedTime}): <a href="${message.url}" target="_blank">My current location</a></li>`;
    messages.insertAdjacentHTML('beforeend', markup);
};

socket.on('connect',() => console.log('Connected to server'));

socket.on('newMessage', message => {
    if(message) {
        renderMessage(message);
    }
});

socket.on('newLocationMessage', message => {
    if (message) {
        renderLocationMessage(message);
    }
});

form.addEventListener('submit', event => {
    event.preventDefault();
    
    const message = getMessage();
    socket.emit('createMessage', {
        from: 'Hugh',
        text: message
    }, function(data) {
        console.log('Got it!', data);    
    });
    
    clearInput();
});

locationBtn.addEventListener('click', event => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationBtn.setAttribute('disabled', 'disabled');
    locationBtn.textContent = 'Sending location...';

    navigator.geolocation.getCurrentPosition(position => {
        // console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationBtn.removeAttribute('disabled');
        locationBtn.textContent = 'Send location';
    }, err => {
        alert('Unable to fetch location.');
        locationBtn.removeAttribute('disabled');
        locationBtn.textContent = 'Send location';
    })
});

socket.on('disconnect', () => console.log('Disconnected from server'));