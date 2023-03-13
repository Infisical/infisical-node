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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfisicalClient = void 0;
var variables_1 = require("../variables");
var api_1 = require("../api");
var SecretService_1 = __importDefault(require("../services/SecretService"));
var helpers_1 = require("../helpers");
var InfisicalClient = /** @class */ (function () {
    function InfisicalClient(_a) {
        var token = _a.token, _b = _a.siteURL, siteURL = _b === void 0 ? variables_1.INFISICAL_URL : _b, _c = _a.debug, debug = _c === void 0 ? false : _c;
        this.secrets = {};
        this.debug = false;
        this.config = {};
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
        this.debug = debug;
    }
    /**
     * Connect to Infisical and return a new instance of Infisical
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    InfisicalClient.connect = function (_a) {
        var token = _a.token, _b = _a.siteURL, siteURL = _b === void 0 ? variables_1.INFISICAL_URL : _b, _c = _a.attachToProcessEnv, attachToProcessEnv = _c === void 0 ? false : _c, _d = _a.config, config = _d === void 0 ? {} : _d, _e = _a.debug, debug = _e === void 0 ? false : _e;
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        instance = new InfisicalClient({
                            token: token,
                            siteURL: siteURL,
                            debug: debug
                        });
                        return [4 /*yield*/, instance.setup({
                                attachToProcessEnv: attachToProcessEnv,
                                config: config
                            })];
                    case 1:
                        _f.sent();
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    /**
     * Sets up the Infisical client by getting data and secrets
     * associated with the instance's Infisical token
     */
    InfisicalClient.prototype.setup = function (_a) {
        var _b = _a.attachToProcessEnv, attachToProcessEnv = _b === void 0 ? false : _b, _c = _a.config, config = _c === void 0 ? {} : _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, serviceTokenData, secrets_1, err_1;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        this.config = config;
                        return [4 /*yield*/, SecretService_1.default.getDecryptedDetails({
                                apiRequest: this.apiRequest,
                                key: this.key
                            })];
                    case 1:
                        _d = _e.sent(), serviceTokenData = _d.serviceTokenData, secrets_1 = _d.secrets;
                        this.workspaceId = serviceTokenData.workspace;
                        this.environment = serviceTokenData.environment;
                        // set secrets based on default config values
                        Object.keys(config).map(function (key) {
                            var _a, _b, _c;
                            if ((_a = config[key]) === null || _a === void 0 ? void 0 : _a.default) {
                                // case: config has a default value
                                (0, helpers_1.validateValueFormat)({
                                    key: key,
                                    value: config[key].default,
                                    format: config[key].format,
                                    isDefault: true
                                });
                                _this.secrets[key] = config[key].default;
                                if (attachToProcessEnv) {
                                    process.env[key] = String(secrets_1[key]);
                                }
                            }
                            if ((_b = config[key]) === null || _b === void 0 ? void 0 : _b.required) {
                                // case: config is required
                                if (((_c = config[key]) === null || _c === void 0 ? void 0 : _c.default) !== undefined
                                    && secrets_1[key] !== undefined
                                    && process.env[key] !== undefined) {
                                    throw new Error("Expected ".concat(key, " but it is undefined / not found"));
                                }
                            }
                        });
                        // set secrets based on fetched secrets
                        Object.keys(secrets_1).map(function (key) {
                            var _a;
                            var v = secrets_1[key];
                            if (key in config) {
                                // case: pulled key is in config
                                if ((_a = config[key]) === null || _a === void 0 ? void 0 : _a.format) {
                                    // case: config has a format specified
                                    v = (0, helpers_1.castValueToFormat)({
                                        value: secrets_1[key],
                                        format: config[key].format
                                    });
                                }
                            }
                            _this.secrets[key] = v;
                            if (attachToProcessEnv) {
                                process.env[key] = String(secrets_1[key]);
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _e.sent();
                        if (this.debug) {
                            console.log('Failed to set up the Infisical client. Please ensure that your token is valid and try again.');
                            console.error(err_1);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    InfisicalClient.prototype.get = function (key) {
        var _a;
        var value;
        if ((_a = this.secrets) === null || _a === void 0 ? void 0 : _a[key]) {
            value = this.secrets[key];
        }
        else {
            value = process.env[key];
        }
        if (key in this.config) {
            var returnType = this.config[key].format;
            if (returnType === 'number') {
                value = Number(value);
            }
            else if (returnType === 'boolean') {
                value = Boolean(value);
            }
            else if (returnType === 'date') {
                if (typeof value === 'string') {
                    value = new Date(value);
                }
            }
        }
        return value;
    };
    return InfisicalClient;
}());
exports.InfisicalClient = InfisicalClient;
