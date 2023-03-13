import { InfisicalClient } from './client/InfisicalClient';

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
    config?: {
        [key: string]: {
            format: 'string' | 'boolean' | 'number' | 'date';
            default?: string | boolean | number | Date | undefined;
            required?: boolean;
        }
    }
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
    debug,
    config
}: {
    token: string;
    siteURL?: string;
    defaultValues?: { [key: string]: any };
    debug?: boolean;
    config?: {
        [key: string]: {
            format: 'string' | 'boolean' | 'number' | 'date';
            default?: string | boolean | number | Date | undefined;
            required?: boolean;
        }
    }
}) => {
    const instance = await InfisicalClient.connect({
        token,
        siteURL,
        debug
    });

    return instance;
}

export const getSecretValue = (key: string): string | number | boolean | Date | undefined => {
    if (globalInstance) {
        return globalInstance.getSecretValue(key);
    }

    return undefined;
}

export default ({
    connect,
    createConnection,
    getSecretValue
});