import * as crypto from 'crypto';
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import { DecryptAsymmetric, DecryptSymmetric, EncryptAsymmetric, EncryptSymmetric } from '../types/utils';

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
const encryptAsymmetric = ({ plaintext, publicKey, privateKey }: EncryptAsymmetric) => {
	const nonce = nacl.randomBytes(24);
    const ciphertext = nacl.box(
        util.decodeUTF8(plaintext),
        nonce,
        util.decodeBase64(publicKey),
        util.decodeBase64(privateKey)
    );

	return {
		ciphertext: util.encodeBase64(ciphertext),
		nonce: util.encodeBase64(nonce)
	};
};

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
const decryptAsymmetric = ({ ciphertext, nonce, publicKey, privateKey }: DecryptAsymmetric) => nacl.box.open(
        util.decodeBase64(ciphertext),
        util.decodeBase64(nonce),
        util.decodeBase64(publicKey),
        util.decodeBase64(privateKey)
);

/**
 * Return symmetrically encrypted [plaintext] using [key].
 * @param {Object} obj
 * @param {String} obj.plaintext - plaintext to encrypt
 * @param {String} obj.key - hex key
 */
const encryptSymmetric = ({ plaintext, key }: EncryptSymmetric) => {
    const ALGORITHM = 'aes-256-gcm';
    const BLOCK_SIZE_BYTES = 16;

    const iv = crypto.randomBytes(BLOCK_SIZE_BYTES);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    return {
        ciphertext,
        iv: iv.toString('base64'),
        tag: cipher.getAuthTag().toString('base64')
    };
} 

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
const decryptSymmetric = ({ ciphertext, iv, tag, key }: DecryptSymmetric) => {
    const ALGORITHM = 'aes-256-gcm';
    
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64'));

    let cleartext = decipher.update(ciphertext, 'base64', 'utf8');
    cleartext += decipher.final('utf8');

    return cleartext;
}

export {
	encryptAsymmetric,
	decryptAsymmetric,
	encryptSymmetric,
	decryptSymmetric
};
