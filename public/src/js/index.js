const roomList = document.getElementById('activeroom');

const socket = io();

const removeAllChild = node => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

const createChildElement = (el, text, att, attVal) => {
    const node = document.createElement(el);
    const textNode = document.createTextNode(text);
    node.appendChild(textNode);
    node.setAttribute(att, attVal);
    return node;
}

socket.on('updateActiveRooms', rooms => {
    removeAllChild(roomList);
    const node = createChildElement('option', '-- please select --', 'value', '');
    roomList.appendChild(node);

    if(rooms) {
        rooms.forEach(room => {
            const node = createChildElement('option', room, 'value', room, roomList);
            roomList.appendChild(node);
        });
    }
});