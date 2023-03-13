declare const castValueToFormat: ({ value, format }: {
    value: string;
    format: 'string' | 'boolean' | 'number' | 'date';
}) => string | number | boolean | Date;
declare const validateValueFormat: ({ key, value, format, isRequired, isDefault }: {
    key: string;
    value: string | boolean | number | Date | undefined;
    format: 'string' | 'boolean' | 'number' | 'date';
    isRequired?: boolean | undefined;
    isDefault?: boolean | undefined;
}) => void;
export { castValueToFormat, validateValueFormat };
