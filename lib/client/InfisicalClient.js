"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infisical = void 0;
var services_1 = require("../services");
var crypto_1 = require("../utils/crypto");
var variables_1 = require("../variables");
var api_1 = require("../api");
var Infisical = /** @class */ (function () {
    function Infisical(_a) {
        var token = _a.token, _b = _a.siteURL, siteURL = _b === void 0 ? variables_1.INFISICAL_URL : _b;
        this.secrets = null;
        var lastDotIdx = token.lastIndexOf('.');
        var serviceToken = token.substring(0, lastDotIdx);
        var key = token.substring(lastDotIdx + 1);
        this.apiRequest = (0, api_1.createApiRequestWithAuthInterceptor)({
            baseURL: siteURL,
            serviceToken: serviceToken
        });
        this.key = key;
        this.workspaceId = '';
        this.environment = '';
    }
    /**
     * Connect to Infisical and return a new instance of Infisical
     * This method also sets up the global instance to be accessed anywhere else in an app.
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    Infisical.connect = function (_a) {
        var token = _a.token, _b = _a.siteURL, siteURL = _b === void 0 ? variables_1.INFISICAL_URL : _b;
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        instance = new Infisical({
                            token: token,
                            siteURL: siteURL
                        });
                        return [4 /*yield*/, instance.setup()];
                    case 1:
                        _c.sent();
                        this.globalInstance = instance;
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    /**
     * Connect to Infisical and return a new instance of Infisical
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    Infisical.createConnection = function (_a) {
        var token = _a.token, _b = _a.siteURL, siteURL = _b === void 0 ? variables_1.INFISICAL_URL : _b;
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        instance = new Infisical({
                            token: token,
                            siteURL: siteURL
                        });
                        return [4 /*yield*/, instance.setup()];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    ;
    /**
     * Sets up the Infisical client by getting data and secrets
     * associated with the instance's Infisical token
     */
    Infisical.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serviceTokenData, encryptedSecrets, workspaceKey, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, api_1.getServiceTokenData)({
                                apiRequest: this.apiRequest
                            })];
                    case 1:
                        serviceTokenData = _a.sent();
                        return [4 /*yield*/, (0, api_1.getSecrets)({
                                apiRequest: this.apiRequest,
                                workspaceId: serviceTokenData.workspace,
                                environment: serviceTokenData.environment
                            })];
                    case 2:
                        encryptedSecrets = _a.sent();
                        this.workspaceId = serviceTokenData.workspace;
                        this.environment = serviceTokenData.environment;
                        workspaceKey = (0, crypto_1.decryptSymmetric)({
                            ciphertext: serviceTokenData.encryptedKey,
                            iv: serviceTokenData.iv,
                            tag: serviceTokenData.tag,
                            key: this.key
                        });
                        // decrypt secrets
                        this.secrets = services_1.KeyService.decryptSecrets({
                            encryptedSecrets: encryptedSecrets.secrets,
                            workspaceKey: workspaceKey
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log('Failed to set up the Infisical client');
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    Infisical.prototype.getSecret = function (key) {
        var _a;
        var value;
        if ((_a = this.secrets) === null || _a === void 0 ? void 0 : _a[key]) {
            value = this.secrets[key];
        }
        else {
            value = process.env[key];
        }
        return value;
    };
    /**
     * Return value for secret with key [key] from global instance
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    Infisical.getSecret = function (key) {
        var value;
        if (!Infisical.globalInstance) {
            value = process.env[key];
        }
        else {
            value = Infisical.globalInstance.getSecret(key);
        }
        return Infisical.globalInstance.getSecret(key);
    };
    return Infisical;
}());
exports.Infisical = Infisical;
