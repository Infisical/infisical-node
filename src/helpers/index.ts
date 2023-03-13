const castValueToFormat = ({
    value,
    format
}: {
    value: string;
    format: 'string' | 'boolean' | 'number' | 'date'
}) => {
    let v: string | boolean | number | Date = value;
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
}

const validateValueFormat = ({
    key,
    value,
    format,
    isRequired = false,
    isDefault = false
}: {
    key: string;
    value: string | boolean | number | Date | undefined;
    format: 'string' | 'boolean' | 'number' | 'date';
    isRequired?: boolean;
    isDefault?: boolean;
}) => {
    const defaultStr = isDefault ? 'default ' : '';

    if (isRequired && value === undefined) {
       throw new Error(`Required ${defaultStr}${key} cannot be undefined`); 
    }

    switch (format) {
        case 'string':
            if (typeof value !== 'string' && value !== undefined) {
                throw new Error(`Expected ${defaultStr}${key} to be a string value`);
            }
            break;
        case 'boolean':
            if (typeof value !== 'boolean' && value !== undefined) {
                throw new Error(`Expected ${defaultStr}${key} to be a boolean value`);
            }
            break;
        case 'number':
            if (typeof value !== 'number' && value !== undefined) {
                throw new Error(`Expected ${defaultStr}${key} to be a number value`);
            }
            break;
        case 'date':
            if (!(value instanceof Date) && value !== undefined) {
                throw new Error(`Expected ${defaultStr}${key} to be a Date object`);
            }
            break;
        default:
            throw new Error(`Unknown format: ${format}`);
    }
}

export {
    castValueToFormat,
    validateValueFormat
}