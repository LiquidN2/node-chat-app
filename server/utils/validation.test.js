const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should return true if is string', () => {
        const str = '  some string ';
        expect(isRealString(str)).toBeTruthy();
    });

    it('should return false if empty', () => {
        const str = '  ';
        expect(isRealString(str)).toBeFalsy();
    });

    it('should return false if non-string', () => {
        const str = 25;
        expect(isRealString(str)).toBeFalsy();
    });
});