import { InfisicalClient } from './client/InfisicalClient';
import { IConfig } from './interfaces/client';

let globalInstance: InfisicalClient;

export const connect = async ({
    token,
    siteURL,
    attachToProcessEnv,
    debug,
    config
}: {
    token: string;
    siteURL?: string;
    attachToProcessEnv?: boolean;
    debug?: boolean;
    config?: IConfig;
}) => {
    const instance = await InfisicalClient.connect({
        token,
        siteURL,
        attachToProcessEnv,
        debug
    });

    globalInstance = instance;
    return instance;
}

export const createConnection = async ({
    token,
    siteURL,
    defaultValues,
    debug
}: {
    token: string;
    siteURL?: string;
    defaultValues?: { [key: string]: any };
    debug?: boolean;
    config?: IConfig;
}) => {
    const instance = await InfisicalClient.connect({
        token,
        siteURL,
        debug
    });

    return instance;
}

export const get = (key: string): string | number | boolean | Date | undefined => {
    if (globalInstance) {
        return globalInstance.get(key);
    }

    return undefined;
}

export default ({
    connect,
    createConnection,
    get
});