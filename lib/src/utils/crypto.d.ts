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
declare const encryptAsymmetric: ({ plaintext, publicKey, privateKey }: EncryptAsymmetric) => {
    ciphertext: string;
    nonce: string;
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
declare const decryptAsymmetric: ({ ciphertext, nonce, publicKey, privateKey }: DecryptAsymmetric) => Uint8Array | null;
/**
 * Return symmetrically encrypted [plaintext] using [key].
 * @param {Object} obj
 * @param {String} obj.plaintext - plaintext to encrypt
 * @param {String} obj.key - hex key
 */
declare const encryptSymmetric: ({ plaintext, key }: EncryptSymmetric) => {
    ciphertext: string;
    iv: string;
    tag: string;
};
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
declare const decryptSymmetric: ({ ciphertext, iv, tag, key }: DecryptSymmetric) => string;
export { encryptAsymmetric, decryptAsymmetric, encryptSymmetric, decryptSymmetric };
