import { InfisicalClient } from './client/InfisicalClient';

let globalInstance: InfisicalClient;

const connect = async ({
    token,
    siteURL,
    attachToProcessEnv,
    defaultValues,
    debug
}: {
    token: string;
    siteURL?: string;
    attachToProcessEnv?: boolean;
    defaultValues?: { [key: string]: string };
    debug?: boolean;
}) => {
    const instance = await InfisicalClient.connect({
        token,
        siteURL,
        attachToProcessEnv,
        defaultValues,
        debug
    });

    globalInstance = instance;
    return instance;
}

const createConnection = async ({
    token,
    siteURL,
    defaultValues,
    debug
}: {
    token: string;
    siteURL?: string;
    defaultValues?: { [key: string]: string };
    debug?: boolean;
}) => {
    const instance = await InfisicalClient.connect({
        token,
        siteURL,
        defaultValues,
        debug
    });

    return instance;
}

const getSecretValue = (key: string): string | undefined => {
    if (globalInstance) {
        return globalInstance.getSecretValue(key);
    }

    return undefined;
}

export {
    connect,
    createConnection,
    getSecretValue
}
