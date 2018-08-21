const socket = io(); // client makes a request to server to open a web socket and keeps that socket open

const messages = document.getElementById('messages');
const form = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const locationBtn = document.getElementById('send-location');
const messageTemplateText = document.getElementById('message-template-text').innerHTML;
const messageTemplateLocation = document.getElementById('message-template-location').innerHTML;

const clearMessageInput = () => messageInput.value = '';
const getMessageInput = () => messageInput.value;

const renderMessage = type => {
    return function (message) {
        const formattedTime = moment(message.createdAt).format('h:mm a');
        
        let template, data;
        switch (type) {
            case 'text':
                template = messageTemplateText;
                data = {
                    from: message.from,
                    createdAt: formattedTime,
                    text: message.text
                };
                break;

            case 'location':
                template = messageTemplateLocation;
                data = {
                    from: message.from,
                    createdAt: formattedTime,
                    url: message.url
                };
                break;
        }
        
        const markup = Mustache.render(template, data);
        messages.insertAdjacentHTML('beforeend', markup);
    };
};

const renderMessageText = renderMessage('text');
const renderMessageLocation = renderMessage('location');

const scrollToBottom = () => {
    const messages = document.getElementById('messages');
    const clientHeight = messages.clientHeight;
    const scrollTop = messages.scrollTop;
    const scrollHeight = messages.scrollHeight;

    let newMessage, prevMessage;
    let newMessageHeight = 0;
    let prevMessageHeight = 0;

    if (messages.children.length > 0) {
        newMessage = messages.lastElementChild;
        newMessageHeight = newMessage.offsetHeight;
    }

    if (messages.children.length > 1) {
        prevMessage = newMessage.previousElementSibling;
        prevMessageHeight = prevMessage.offsetHeight;
    }

    if (clientHeight + scrollTop + newMessageHeight + prevMessageHeight >= scrollHeight) {
        console.log('should scroll');
        $('#messages').scrollTop(scrollHeight);
    }
};

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