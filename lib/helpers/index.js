"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateValueFormat = exports.castValueToFormat = void 0;
var castValueToFormat = function (_a) {
    var value = _a.value, format = _a.format;
    var v = value;
    switch (format) {
        case 'string':
            v = String(value);
            break;
        case 'boolean':
            v = Boolean(value);
            break;
        case 'number':
            v = Number(value);
            break;
        case 'date':
            v = new Date(value);
            break;
    }
    return v;
};
exports.castValueToFormat = castValueToFormat;
var validateValueFormat = function (_a) {
    var key = _a.key, value = _a.value, format = _a.format, _b = _a.isRequired, isRequired = _b === void 0 ? false : _b, _c = _a.isDefault, isDefault = _c === void 0 ? false : _c;
    var defaultStr = isDefault ? 'default ' : '';
    if (isRequired && value === undefined) {
        throw new Error("Required ".concat(defaultStr).concat(key, " cannot be undefined"));
    }
    switch (format) {
        case 'string':
            if (typeof value !== 'string' && value !== undefined) {
                throw new Error("Expected ".concat(defaultStr).concat(key, " to be a string value"));
            }
            break;
        case 'boolean':
            if (typeof value !== 'boolean' && value !== undefined) {
                throw new Error("Expected ".concat(defaultStr).concat(key, " to be a boolean value"));
            }
            break;
        case 'number':
            if (typeof value !== 'number' && value !== undefined) {
                throw new Error("Expected ".concat(defaultStr).concat(key, " to be a number value"));
            }
            break;
        case 'date':
            if (!(value instanceof Date) && value !== undefined) {
                throw new Error("Expected ".concat(defaultStr).concat(key, " to be a Date object"));
            }
            break;
        default:
            throw new Error("Unknown format: ".concat(format));
    }
};
exports.validateValueFormat = validateValueFormat;
