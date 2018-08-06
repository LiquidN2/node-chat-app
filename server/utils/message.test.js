const expect = require('expect');

const {generateMessage} = require('./message');


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