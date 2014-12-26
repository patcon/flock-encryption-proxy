var encrypt = require('./crypto').encrypt;
var decrypt = require('./crypto').decrypt;

var blob = encrypt("FOO");
console.log(blob);

var unblob = decrypt(blob);
console.log(unblob);
