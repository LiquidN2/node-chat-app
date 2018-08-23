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
        // console.log('should scroll');
        $('#messages').scrollTop(scrollHeight);
    }
};

export {
    form, 
    locationBtn, 
    clearMessageInput, 
    getMessageInput, 
    renderMessageText,
    renderMessageLocation,
    scrollToBottom
};