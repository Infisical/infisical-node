import { InfisicalClient } from './client/InfisicalClient';
import { IConfig } from './interfaces/client';
export declare const connect: ({ token, siteURL, attachToProcessEnv, debug, config }: {
    token: string;
    siteURL?: string | undefined;
    attachToProcessEnv?: boolean | undefined;
    debug?: boolean | undefined;
    config?: IConfig | undefined;
}) => Promise<InfisicalClient>;
export declare const createConnection: ({ token, siteURL, defaultValues, debug }: {
    token: string;
    siteURL?: string | undefined;
    defaultValues?: {
        [key: string]: any;
    } | undefined;
    debug?: boolean | undefined;
    config?: IConfig | undefined;
}) => Promise<InfisicalClient>;
export declare const get: (key: string) => string | number | boolean | Date | undefined;
declare const _default: {
    connect: ({ token, siteURL, attachToProcessEnv, debug, config }: {
        token: string;
        siteURL?: string | undefined;
        attachToProcessEnv?: boolean | undefined;
        debug?: boolean | undefined;
        config?: IConfig | undefined;
    }) => Promise<InfisicalClient>;
    createConnection: ({ token, siteURL, defaultValues, debug }: {
        token: string;
        siteURL?: string | undefined;
        defaultValues?: {
            [key: string]: any;
        } | undefined;
        debug?: boolean | undefined;
        config?: IConfig | undefined;
    }) => Promise<InfisicalClient>;
    get: (key: string) => string | number | boolean | Date | undefined;
};
export default _default;
