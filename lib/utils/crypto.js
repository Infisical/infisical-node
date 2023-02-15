"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptSymmetric = exports.encryptSymmetric = exports.decryptAsymmetric = exports.encryptAsymmetric = void 0;
var crypto = require("crypto");
var nacl = require("tweetnacl");
var util = require("tweetnacl-util");
/**
 * Return assymmetrically encrypted [plaintext] using [publicKey] where
 * [publicKey] likely belongs to the recipient.
 * @param {Object} obj
 * @param {String} obj.plaintext - plaintext to encrypt
 * @param {String} obj.publicKey - public key of the recipient
 * @param {String} obj.privateKey - private key of the sender (current user)
 * @returns {Object} obj
 * @returns {String} ciphertext - base64-encoded ciphertext
 * @returns {String} nonce - base64-encoded nonce
 */
var encryptAsymmetric = function (_a) {
    var plaintext = _a.plaintext, publicKey = _a.publicKey, privateKey = _a.privateKey;
    var nonce = nacl.randomBytes(24);
    var ciphertext = nacl.box(util.decodeUTF8(plaintext), nonce, util.decodeBase64(publicKey), util.decodeBase64(privateKey));
    return {
        ciphertext: util.encodeBase64(ciphertext),
        nonce: util.encodeBase64(nonce)
    };
};
exports.encryptAsymmetric = encryptAsymmetric;
/**
 * Return assymmetrically decrypted [ciphertext] using [privateKey] where
 * [privateKey] likely belongs to the recipient.
 * @param {Object} obj
 * @param {String} obj.ciphertext - ciphertext to decrypt
 * @param {String} obj.nonce - nonce
 * @param {String} obj.publicKey - public key of the sender
 * @param {String} obj.privateKey - private key of the receiver (current user)
 * @param {String} plaintext - UTF8 plaintext
 */
var decryptAsymmetric = function (_a) {
    var ciphertext = _a.ciphertext, nonce = _a.nonce, publicKey = _a.publicKey, privateKey = _a.privateKey;
    return nacl.box.open(util.decodeBase64(ciphertext), util.decodeBase64(nonce), util.decodeBase64(publicKey), util.decodeBase64(privateKey));
};
exports.decryptAsymmetric = decryptAsymmetric;
/**
 * Return symmetrically encrypted [plaintext] using [key].
 * @param {Object} obj
 * @param {String} obj.plaintext - plaintext to encrypt
 * @param {String} obj.key - hex key
 */
var encryptSymmetric = function (_a) {
    var plaintext = _a.plaintext, key = _a.key;
    var ALGORITHM = 'aes-256-gcm';
    var BLOCK_SIZE_BYTES = 16;
    var iv = crypto.randomBytes(BLOCK_SIZE_BYTES);
    var cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    var ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    return {
        ciphertext: ciphertext,
        iv: iv.toString('base64'),
        tag: cipher.getAuthTag().toString('base64')
    };
};
exports.encryptSymmetric = encryptSymmetric;
/**
 * Return symmetrically decypted [ciphertext] using [iv], [tag],
 * and [key].
 * @param {Object} obj
 * @param {String} obj.ciphertext - ciphertext to decrypt
 * @param {String} obj.iv - iv
 * @param {String} obj.tag - tag
 * @param {String} obj.key - hex key
 *
 */
var decryptSymmetric = function (_a) {
    var ciphertext = _a.ciphertext, iv = _a.iv, tag = _a.tag, key = _a.key;
    var ALGORITHM = 'aes-256-gcm';
    var decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    var cleartext = decipher.update(ciphertext, 'base64', 'utf8');
    cleartext += decipher.final('utf8');
    return cleartext;
};
exports.decryptSymmetric = decryptSymmetric;
