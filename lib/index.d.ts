import { InfisicalClient } from './client/InfisicalClient';
export declare const connect: ({ token, siteURL, attachToProcessEnv, debug, }: {
    token: string;
    siteURL?: string | undefined;
    attachToProcessEnv?: boolean | undefined;
    debug?: boolean | undefined;
}) => Promise<InfisicalClient>;
export declare const createConnection: ({ token, siteURL, defaultValues, debug }: {
    token: string;
    siteURL?: string | undefined;
    defaultValues?: {
        [key: string]: any;
    } | undefined;
    debug?: boolean | undefined;
}) => Promise<InfisicalClient>;
export declare const get: (key: string) => string | undefined;
declare const _default: {
    connect: ({ token, siteURL, attachToProcessEnv, debug, }: {
        token: string;
        siteURL?: string | undefined;
        attachToProcessEnv?: boolean | undefined;
        debug?: boolean | undefined;
    }) => Promise<InfisicalClient>;
    createConnection: ({ token, siteURL, defaultValues, debug }: {
        token: string;
        siteURL?: string | undefined;
        defaultValues?: {
            [key: string]: any;
        } | undefined;
        debug?: boolean | undefined;
    }) => Promise<InfisicalClient>;
    get: (key: string) => string | undefined;
};
export default _default;
