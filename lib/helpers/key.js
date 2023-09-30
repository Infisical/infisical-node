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
exports.populateClientWorkspaceConfigsHelper = void 0;
var variables_1 = require("../variables");
var api_1 = require("../api");
var crypto_1 = require("../utils/crypto");
var populateClientWorkspaceConfigsHelper = function (clientConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, serviceTokenData, workspaceKey, _b, workspace, encryptedKey, nonce, publicKey, workspaceKey;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = clientConfig.authMode;
                switch (_a) {
                    case variables_1.AuthMode.SERVICE_TOKEN: return [3 /*break*/, 1];
                    case variables_1.AuthMode.SERVICE_TOKEN_V3: return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 1: return [4 /*yield*/, (0, api_1.getServiceTokenData)({
                    apiRequest: clientConfig.apiRequest
                })];
            case 2:
                serviceTokenData = _c.sent();
                workspaceKey = (0, crypto_1.decryptSymmetric128BitHexKeyUTF8)({
                    ciphertext: serviceTokenData.encryptedKey,
                    iv: serviceTokenData.iv,
                    tag: serviceTokenData.tag,
                    key: clientConfig.credentials.serviceTokenKey
                });
                return [2 /*return*/, ({
                        workspaceId: serviceTokenData.workspace,
                        workspaceKey: workspaceKey
                    })];
            case 3: return [4 /*yield*/, (0, api_1.getServiceTokenDataKey)({
                    apiRequest: clientConfig.apiRequest
                })];
            case 4:
                _b = (_c.sent()).key, workspace = _b.workspace, encryptedKey = _b.encryptedKey, nonce = _b.nonce, publicKey = _b.publicKey;
                workspaceKey = (0, crypto_1.decryptAsymmetric)({
                    ciphertext: encryptedKey,
                    nonce: nonce,
                    publicKey: publicKey,
                    privateKey: clientConfig.credentials.privateKey
                });
                return [2 /*return*/, ({
                        workspaceId: workspace,
                        workspaceKey: workspaceKey
                    })];
            case 5: throw Error("Failed to populate workspace config");
        }
    });
}); };
exports.populateClientWorkspaceConfigsHelper = populateClientWorkspaceConfigsHelper;
