const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message', () => {
        const messageObj = {
            from: 'hugh',
            text: 'this is the body of the message'
        };

        const message = generateMessage(messageObj.from, messageObj.text);

        expect(message).toMatchObject(messageObj);
        expect(typeof message.createdAt).toBe('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate the correct location object', () => {
        const from = 'Hugh';
        const latitude = 15;
        const longitude = 20;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        const locationMessage = generateLocationMessage(from, latitude, longitude);

        expect(locationMessage.from).toBe(from);
        expect(locationMessage.url).toBe(url);
        expect(typeof locationMessage.createdAt).toBe('number');
    });
});