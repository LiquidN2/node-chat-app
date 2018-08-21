import { form, locationBtn, clearMessageInput, getMessageInput, renderMessageText, renderMessageLocation, scrollToBottom } from './chatView';

const socket = io(); // client makes a request to server to open a web socket and keeps that socket open

socket.on('connect', () => console.log('Connected to server'));

socket.on('newMessage', message => {
    if (message) renderMessageText(message);
    scrollToBottom();
});

socket.on('newLocationMessage', message => {
    if (message) renderMessageLocation(message);
    scrollToBottom();
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const message = getMessageInput();

    if (message) {
        socket.emit('createMessage', {
            from: 'Hugh',
            text: message
        }, function (data) {
            console.log('Got it!', data);
        });
    }

    clearMessageInput();
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