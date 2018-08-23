const expect = require('expect');

const {Users} = require('./users');

describe('class Users', () => {
    let users;
    
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'John',
            room: 'A'
        },{
            id: '2',
            name: 'Alex',
            room: 'B'
        },{
            id: '3',
            name: 'Nathan',
            room: 'A'
        },{
            id: '4',
            name: 'John Doe',
            room: 'C'
        }]
    });

    it('should add new user', () => {
        const users = new Users();
        const newUser = users.addUser(1234, 'Hugh', 'A');
        expect(users.users.length).toEqual(1);
        expect(users.users[0]).toMatchObject(newUser);
    });

    it('should remove existing user', () => {
        const originalUserNum = users.users.length;
        const removedUser = users.removeUser('3');
        expect(removedUser).toMatchObject({
            id: '3',
            name: 'Nathan',
            room: 'A'
        });
        expect(users.users.length).toBeLessThan(originalUserNum);
    });

    it('should not remove if user does not exist', () => {
        const originalUserNum = users.users.length;
        const removedUser = users.removeUser('5');
        expect(removedUser).toBeFalsy();
        expect(users.users.length).toEqual(originalUserNum);
    });

    it('should find user', () => {
        const user = users.getUser('2');
        expect(user).toMatchObject({
            id: '2',
            name: 'Alex',
            room: 'B'
        });
    });

    it('should not find user', () => {
        const user = users.getUser('X');
        expect(user).toBeFalsy();
    });

    it('should return all users in a room', () => {
        const usersInRoomA = users.getUserList('A');
        expect(usersInRoomA.length).toEqual(2);
    });

    it('should return unique rooms', () => {
        const uniqueRooms = users.getRoomList();
        expect(uniqueRooms.length).toEqual(3);
    });
});
