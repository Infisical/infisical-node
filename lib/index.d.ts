import { InfisicalClient } from './client/InfisicalClient';
export declare const connect: ({ token, siteURL, attachToProcessEnv, debug, config }: {
    token: string;
    siteURL?: string | undefined;
    attachToProcessEnv?: boolean | undefined;
    debug?: boolean | undefined;
    config?: {
        [key: string]: {
            format: 'string' | 'boolean' | 'number' | 'date';
            default?: string | boolean | number | Date | undefined;
            required?: boolean | undefined;
        };
    } | undefined;
}) => Promise<InfisicalClient>;
export declare const createConnection: ({ token, siteURL, defaultValues, debug }: {
    token: string;
    siteURL?: string | undefined;
    defaultValues?: {
        [key: string]: any;
    } | undefined;
    debug?: boolean | undefined;
    config?: {
        [key: string]: {
            format: 'string' | 'boolean' | 'number' | 'date';
            default?: string | boolean | number | Date | undefined;
            required?: boolean | undefined;
        };
    } | undefined;
}) => Promise<InfisicalClient>;
export declare const get: (key: string) => string | number | boolean | Date | undefined;
declare const _default: {
    connect: ({ token, siteURL, attachToProcessEnv, debug, config }: {
        token: string;
        siteURL?: string | undefined;
        attachToProcessEnv?: boolean | undefined;
        debug?: boolean | undefined;
        config?: {
            [key: string]: {
                format: "string" | "number" | "boolean" | "date";
                default?: string | number | boolean | Date | undefined;
                required?: boolean | undefined;
            };
        } | undefined;
    }) => Promise<InfisicalClient>;
    createConnection: ({ token, siteURL, defaultValues, debug }: {
        token: string;
        siteURL?: string | undefined;
        defaultValues?: {
            [key: string]: any;
        } | undefined;
        debug?: boolean | undefined;
        config?: {
            [key: string]: {
                format: "string" | "number" | "boolean" | "date";
                default?: string | number | boolean | Date | undefined;
                required?: boolean | undefined;
            };
        } | undefined;
    }) => Promise<InfisicalClient>;
    get: (key: string) => string | number | boolean | Date | undefined;
};
export default _default;
