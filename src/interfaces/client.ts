interface IConfig {
    [key: string]: {
        format: 'string' | 'boolean' | 'number' | 'date';
        default?: string | boolean | number | Date | undefined;
        required?: boolean;
    }
};

export {
    IConfig
}