"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCODING_SCHEME_BASE64 = exports.ENCODING_SCHEME_HEX = exports.ENCODING_SCHEME_UTF8 = exports.SYMMETRIC_KEY_BYTES_SIZE = exports.IV_BYTES_SIZE = exports.ALGORITHM_AES_256_GCM = exports.AuthMode = exports.INFISICAL_URL = void 0;
exports.INFISICAL_URL = 'https://app.infisical.com';
var AuthMode;
(function (AuthMode) {
    AuthMode["SERVICE_TOKEN"] = "serviceToken";
    AuthMode["SERVICE_TOKEN_V3"] = "serviceTokenV3";
})(AuthMode = exports.AuthMode || (exports.AuthMode = {}));
exports.ALGORITHM_AES_256_GCM = 'aes-256-gcm';
exports.IV_BYTES_SIZE = 12;
exports.SYMMETRIC_KEY_BYTES_SIZE = 32;
exports.ENCODING_SCHEME_UTF8 = 'utf8';
exports.ENCODING_SCHEME_HEX = 'hex';
exports.ENCODING_SCHEME_BASE64 = 'base64';
