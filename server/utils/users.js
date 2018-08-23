const {removeDuplicates} = require('./helpers');

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = {
            id: id.toString(),
            name, 
            room
        };
        this.users.push(user);
        return user;
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
    }

    getUserList(room) {
        const userList = this.users.filter(user => user.room === room);
        const userNames = userList.map(user => user.name);
        // return userList;
        return userNames;
    }

    removeUser(id) {
        const userToRemove = this.getUser(id);
        if (userToRemove) {
            this.users = this.users.filter(user => user.id !== id);
            return userToRemove;
        }
    }

    getRoomList() {
        const rooms = this.users.map(user => user.room);
        const uniqueRooms = removeDuplicates(rooms);
        return uniqueRooms;
    }

    getUserName(name) {
        return this.users.filter(user => user.name === name);
    }

    isExisting(name, room) {
        const existingUser = this.users.filter(user => {
            if (user.room === room && user.name === name) {
                return true;
            }
        });

        return existingUser.length;
    }
}

module.exports = { Users };
