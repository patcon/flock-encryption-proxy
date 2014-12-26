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


var crypto, config, CIPHER_ALGO, CIPHER_KEY, HMAC_ALGO, HMAC_KEY, MAC_LENGTH_BYTES, IV_LENGTH_BYTES;

crypto = require('crypto');
config = require('./config.json');

CIPHER_ALGO = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
HMAC_ALGO = 'SHA256';
CIPHER_KEY = new Buffer(config.cipherKey, 'base64');
HMAC_KEY = new Buffer(config.macKey, 'base64');

MAC_LENGTH_BYTES = 32;
IV_LENGTH_BYTES = 16;

var encrypt = function (plain_text) {

    var version = new Buffer([1]);
    var iv = new Buffer(crypto.randomBytes(16)); // ensure that the IV (initialization vector) is random
    var cipher_text;
    var cipher_arr;
    var hmac;
    var encryptor;

    encryptor = crypto.createCipheriv(CIPHER_ALGO, CIPHER_KEY, iv);
    cipher_arr = [];
    cipher_arr.push(encryptor.update(plain_text, 'utf8'));
    cipher_arr.push(encryptor.final());
    cipher_text = new Buffer.concat(cipher_arr);

    hmac = crypto.createHmac(HMAC_ALGO, HMAC_KEY);
    hmac.update(new Buffer.concat([version, iv, cipher_text]));

    // The IV isn't a secret so it can be stored along side everything else
    var blob = new Buffer.concat([version, iv, cipher_text, hmac.digest()]);

    return blob.toString('base64');
};

var decrypt = function (cipher_text) {
    var blob    = new Buffer(cipher_text, 'base64');
    var version = blob.slice(0, 1);
    var iv      = blob.slice(1, 1+IV_LENGTH_BYTES);
    var ct      = blob.slice(1+IV_LENGTH_BYTES, blob.length-MAC_LENGTH_BYTES);
    var hmac    = blob.slice(blob.length-MAC_LENGTH_BYTES, blob.length);
    var decryptor;

    chmac = crypto.createHmac(HMAC_ALGO, HMAC_KEY);
    chmac.update(new Buffer.concat([version, iv, ct]));

    if (!constant_time_compare(chmac.digest('hex'), hmac.toString('hex'))) {
        console.log("Encrypted Blob has been tampered with...");
        return null;
    }

    decryptor = crypto.createDecipheriv(CIPHER_ALGO, CIPHER_KEY, iv);
    decryptor.update(ct);

    return decryptor.final('utf-8')
};

var constant_time_compare = function (val1, val2) {
    var sentinel;

    if (val1.length !== val2.length) {
        return false;
    }


    for (var i = 0; i <= (val1.length - 1); i++) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }

    return sentinel === 0
};

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
}
