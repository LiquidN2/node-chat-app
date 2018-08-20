const moment = require('moment');

const date = moment();
console.log(date.format('Do MMM YYYY'));
console.log(date.format('h:mm a'));

const someTimeStamp = moment().valueOf();
console.log(someTimeStamp);