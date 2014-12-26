/*
 Copyright 2014 Levi Gross. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */


var crypto, config, ALGORITHM, KEY, HMAC_ALGORITHM, HMAC_KEY, MAC_LENGTH_BYTES, IV_LENGTH_BYTES;

crypto = require('crypto');
config = require('./config.json');

ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
HMAC_ALGORITHM = 'SHA256';
KEY = new Buffer(config.cipherKey, 'base64');
HMAC_KEY = new Buffer(config.macKey, 'base64');

MAC_LENGTH_BYTES = 32;
IV_LENGTH_BYTES = 16;

var encrypt = function (plain_text) {

    var version = new Buffer([1]);
    var IV = new Buffer(crypto.randomBytes(16)); // ensure that the IV (initialization vector) is random
    var cipher_text;
    var hmac;
    var encryptor;

    encryptor = crypto.createCipheriv(ALGORITHM, KEY, IV);
    //encryptor.setEncoding('hex');
    encryptor.write(plain_text);
    encryptor.end();

    cipher_text = encryptor.read();

    hmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
    hmac.update(cipher_text);
    hmac.update(IV.toString('hex')); // ensure that both the IV and the cipher-text is protected by the HMAC

    var blob = new Buffer.concat([version, IV, cipher_text, hmac.digest()]);

    // The IV isn't a secret so it can be stored along side everything else
    return blob.toString('base64');

};

var decrypt = function (cipher_text) {
    var blob = new Buffer(cipher_text, 'base64');
    var version = blob[0];
    var IV      = blob.slice(1, 1+IV_LENGTH_BYTES);
    var ct      = blob.slice(1+IV_LENGTH_BYTES, blob.length-MAC_LENGTH_BYTES).toString('hex');
    var hmac    = blob.slice(blob.length-MAC_LENGTH_BYTES, blob.length).toString('hex');
    var decryptor;

    chmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
    chmac.update(ct);
    chmac.update(IV.toString('hex'));

    if (!constant_time_compare(chmac.digest('hex'), hmac)) {
        console.log("Encrypted Blob has been tampered with...");
        //return null;
    }

    decryptor = crypto.createDecipheriv(ALGORITHM, KEY, IV);
    decryptor.update(ct, 'hex', 'utf8');
    return decryptor.final('utf-8')


};

var constant_time_compare = function (val1, val2) {
    var sentinel;
    console.log(val1);
    console.log(val2);

    if (val1.length !== val2.length) {
        return false;
    }


    for (var i = 0; i <= (val1.length - 1); i++) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }

    return sentinel === 0
};

var blob = encrypt("FOO");
console.log(blob);
var unblob = decrypt(blob);
console.log(unblob);
