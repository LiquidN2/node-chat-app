import { form, locationBtn, clearMessageInput, getMessageInput, renderMessageText, renderMessageLocation, scrollToBottom } from './chatView';

const removeAllChild = node => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

const userListContainer = document.getElementById('users');

const socket = io(); // client makes a request to server to open a web socket and keeps that socket open

// when client is connected with chat server
socket.on('connect', () => {
    const params = jQuery.deparam(window.location.search); // convert search params to object
    socket.emit('join', params, err => {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', () => console.log('Disconnected from server'));

socket.on('updateUserList', users => {
    const userList = document.createElement('ol');
    
    removeAllChild(userListContainer);
    
    users.forEach(user => {
        const node = document.createElement('li');
        const textnode = document.createTextNode(user);
        node.appendChild(textnode);
        userList.appendChild(node);
    });
    
    userListContainer.appendChild(userList);
});

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

