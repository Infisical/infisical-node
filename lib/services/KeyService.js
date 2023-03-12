"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("../utils/crypto");
/**
 * Class for key-related actions
 */
var KeyService = /** @class */ (function () {
    function KeyService() {
    }
    KeyService.decryptSecrets = function (_a) {
        var encryptedSecrets = _a.encryptedSecrets, workspaceKey = _a.workspaceKey;
        // console.log('encryptedSecrets', encryptedSecrets);
        var secretsObj = {};
        // decrypt secret keys, values, and comments
        encryptedSecrets.forEach(function (encryptedSecret) {
            var key = (0, crypto_1.decryptSymmetric)({
                ciphertext: encryptedSecret.secretKeyCiphertext,
                iv: encryptedSecret.secretKeyIV,
                tag: encryptedSecret.secretKeyTag,
                key: workspaceKey
            });
            var value = (0, crypto_1.decryptSymmetric)({
                ciphertext: encryptedSecret.secretValueCiphertext,
                iv: encryptedSecret.secretValueIV,
                tag: encryptedSecret.secretValueTag,
                key: workspaceKey
            });
            secretsObj[key] = value;
        });
        return secretsObj;
    };
    return KeyService;
}());
exports.default = KeyService;
