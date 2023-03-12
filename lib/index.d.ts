import { InfisicalClient } from './client/InfisicalClient';
declare const connect: ({ token, siteURL, attachToProcessEnv, defaultValues }: {
    token: string;
    siteURL?: string | undefined;
    attachToProcessEnv?: boolean | undefined;
    defaultValues?: {
        [key: string]: string;
    } | undefined;
}) => Promise<InfisicalClient>;
declare const createConnection: ({ token, siteURL, defaultValues }: {
    token: string;
    siteURL?: string | undefined;
    defaultValues?: {
        [key: string]: string;
    } | undefined;
}) => Promise<InfisicalClient>;
declare const getSecretValue: (key: string) => string | undefined;
export { connect, createConnection, getSecretValue };
