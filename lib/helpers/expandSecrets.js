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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandSecrets = void 0;
var path_1 = __importDefault(require("path"));
var crypto_1 = require("../utils/crypto");
var api_1 = require("../api");
var fetchSecretsCrossEnv = function (_a) {
    var apiRequest = _a.apiRequest, workspaceId = _a.workspaceId, environment = _a.environment, workspaceKey = _a.workspaceKey, secretPath = _a.secretPath, includeImports = _a.includeImports;
    var fetchCache = {};
    return function (secRefEnv, secRefPath, secRefKey) { return __awaiter(void 0, void 0, void 0, function () {
        var secRefPathUrl, uniqKey, secrets, decryptedSec;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    secRefPathUrl = (_a = path_1.default.posix).join.apply(_a, __spreadArray(['/'], secRefPath, false));
                    uniqKey = "".concat(secRefEnv, "-").concat(secRefPathUrl);
                    if (fetchCache === null || fetchCache === void 0 ? void 0 : fetchCache[uniqKey]) {
                        console.log("Returning cached value");
                        return [2 /*return*/, fetchCache[uniqKey][secRefKey]];
                    }
                    return [4 /*yield*/, (0, api_1.getSecrets)(apiRequest, {
                            workspaceId: workspaceId,
                            environment: environment,
                            path: secRefPathUrl,
                            includeImports: includeImports
                        })];
                case 1:
                    secrets = (_b.sent()).secrets;
                    decryptedSec = secrets.reduce(function (prev, secret) {
                        var secretKey = (0, crypto_1.decryptSymmetric128BitHexKeyUTF8)({
                            ciphertext: secret.secretKeyCiphertext,
                            iv: secret.secretKeyIV,
                            tag: secret.secretKeyTag,
                            key: workspaceKey
                        });
                        var secretValue = (0, crypto_1.decryptSymmetric128BitHexKeyUTF8)({
                            ciphertext: secret.secretValueCiphertext,
                            iv: secret.secretValueIV,
                            tag: secret.secretValueTag,
                            key: workspaceKey
                        });
                        prev[secretKey] = secretValue;
                        return prev;
                    }, {});
                    fetchCache[uniqKey] = decryptedSec;
                    return [2 /*return*/, fetchCache[uniqKey][secRefKey]];
            }
        });
    }); };
};
var INTERPOLATION_SYNTAX_REG = new RegExp(/\${([^}]+)}/g);
var recursivelyExpandSecret = function (expandedSec, interpolatedSec, fetchCrossEnv, recursionChainBreaker, key) { return __awaiter(void 0, void 0, void 0, function () {
    var interpolatedValue, refs, resolvedValues, _i, refs_1, interpolationSyntax, interpolationKey, entities, val, secRefEnv, secRefPath, secRefKey, val;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (expandedSec === null || expandedSec === void 0 ? void 0 : expandedSec[key])
                    return [2 /*return*/, expandedSec[key]];
                if (recursionChainBreaker === null || recursionChainBreaker === void 0 ? void 0 : recursionChainBreaker[key])
                    return [2 /*return*/, ""];
                recursionChainBreaker[key] = true;
                interpolatedValue = interpolatedSec[key];
                if (!interpolatedValue) {
                    // eslint-disable-next-line no-console
                    console.error("Couldn't find referenced value - ".concat(key));
                    return [2 /*return*/, ""];
                }
                refs = interpolatedValue.match(INTERPOLATION_SYNTAX_REG);
                if (!refs) return [3 /*break*/, 7];
                resolvedValues = [];
                _i = 0, refs_1 = refs;
                _a.label = 1;
            case 1:
                if (!(_i < refs_1.length)) return [3 /*break*/, 6];
                interpolationSyntax = refs_1[_i];
                interpolationKey = interpolationSyntax.slice(2, interpolationSyntax.length - 1);
                entities = interpolationKey.trim().split(".");
                if (!(entities.length === 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, recursivelyExpandSecret(expandedSec, interpolatedSec, fetchCrossEnv, recursionChainBreaker, interpolationKey)];
            case 2:
                val = _a.sent();
                if (val)
                    resolvedValues.push({ interpolationSyntax: interpolationSyntax, val: val });
                return [3 /*break*/, 5];
            case 3:
                if (!(entities.length > 1)) return [3 /*break*/, 5];
                secRefEnv = entities[0];
                secRefPath = entities.slice(1, entities.length - 1);
                secRefKey = entities[entities.length - 1];
                return [4 /*yield*/, fetchCrossEnv(secRefEnv, secRefPath, secRefKey)];
            case 4:
                val = _a.sent();
                if (val)
                    resolvedValues.push({ interpolationSyntax: interpolationSyntax, val: val });
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                resolvedValues.forEach(function (_a) {
                    var interpolationSyntax = _a.interpolationSyntax, val = _a.val;
                    var regex = new RegExp(interpolationSyntax.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                    interpolatedValue = interpolatedValue.replace(regex, val);
                });
                _a.label = 7;
            case 7:
                expandedSec[key] = interpolatedValue;
                return [2 /*return*/, interpolatedValue];
        }
    });
}); };
// used to convert multi line ones to quotes ones with \n
var formatMultiValueEnv = function (val) {
    if (!val)
        return "";
    if (!val.match("\n"))
        return val;
    return "\"".concat(val.replace(/\n/g, "\\n"), "\"");
};
var expandSecrets = function (workspaceId, workspaceKey, apiRequest, environment, secretPath, secrets, includeImports) { return __awaiter(void 0, void 0, void 0, function () {
    var expandedSec, interpolatedSec, crossSecEnvFetch, _i, _a, key, recursionChainBreaker, expandedVal;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                expandedSec = {};
                interpolatedSec = {};
                crossSecEnvFetch = fetchSecretsCrossEnv({
                    workspaceId: workspaceId,
                    workspaceKey: workspaceKey,
                    apiRequest: apiRequest,
                    environment: environment,
                    secretPath: secretPath,
                    includeImports: includeImports ? includeImports : false
                });
                Object.keys(secrets).forEach(function (key) {
                    if (secrets[key].value.match(INTERPOLATION_SYNTAX_REG)) {
                        interpolatedSec[key] = secrets[key].value;
                    }
                    else {
                        expandedSec[key] = secrets[key].value;
                    }
                });
                _i = 0, _a = Object.keys(secrets);
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                key = _a[_i];
                if (expandedSec === null || expandedSec === void 0 ? void 0 : expandedSec[key]) {
                    // should not do multi line encoding if user has set it to skip
                    secrets[key].value = secrets[key].skipMultilineEncoding
                        ? expandedSec[key]
                        : formatMultiValueEnv(expandedSec[key]);
                    return [3 /*break*/, 3];
                }
                recursionChainBreaker = {};
                return [4 /*yield*/, recursivelyExpandSecret(expandedSec, interpolatedSec, crossSecEnvFetch, recursionChainBreaker, key)];
            case 2:
                expandedVal = _b.sent();
                secrets[key].value = secrets[key].skipMultilineEncoding
                    ? expandedVal
                    : formatMultiValueEnv(expandedVal);
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, secrets];
        }
    });
}); };
exports.expandSecrets = expandSecrets;
