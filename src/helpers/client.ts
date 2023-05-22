import InfisicalClient from '../client/InfisicalClient';
import {
    GetOptions,
    CreateOptions,
    UpdateOptions,
    DeleteOptions
} from '../types/InfisicalClient';
import { SecretService } from '../services';
import { ISecretBundle } from '../types/models';

export async function getSecretHelper(instance: InfisicalClient, secretName: string, options: GetOptions): Promise<ISecretBundle> {
    const cacheKey = `${options.type}-${secretName}`;
    let cachedSecret: ISecretBundle | undefined = undefined;
    try {
        if (!instance.clientConfig) throw Error('Failed to find client config');

        if (!instance.clientConfig.workspaceConfig) {
            instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
        }

        cachedSecret = instance.cache[cacheKey];

        if (cachedSecret) {

            const currentTime = new Date();
            const cacheExpiryTime = cachedSecret.lastFetchedAt;
            cacheExpiryTime.setSeconds(cacheExpiryTime.getSeconds() + instance.clientConfig.cacheTTL);

            if (currentTime < cacheExpiryTime) {
                if (instance.debug) {
                    console.log(`Returning cached secret: ${cachedSecret.secretName}`)
                }

                return cachedSecret;
            }
        }

        const secretBundle = await SecretService.getDecryptedSecret({
            apiRequest: instance.clientConfig.apiRequest,
            workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
            secretName,
            workspaceId: instance.clientConfig.workspaceConfig?.workspaceId,
            environment: instance.clientConfig.workspaceConfig?.environment,
            type: options.type
        });


        const shouldUpdateProcessEnv = instance.processEnvConfig && (
            (instance.bundlesLoadedToEnv[secretName].type === 'personal' && secretBundle.type === 'personal') ||
            (instance.bundlesLoadedToEnv[secretName].type === 'shared')
        )

        if (shouldUpdateProcessEnv) {
            process.env[secretName] = secretBundle.secretValue;
            instance.bundlesLoadedToEnv[secretName] = secretBundle;
        }

        instance.cache[secretName] = secretBundle;

        return secretBundle;

    } catch (err) {
        if (instance.debug) console.error(err);

        if (cachedSecret) {
            if (instance.debug) {
                console.log(`Returning cached secret: ${cachedSecret}`);
            }

            return cachedSecret;
        }

        return await SecretService.getFallbackSecret({
            secretName
        });
    }
}

export async function getAllSecretsHelper(instance: InfisicalClient): Promise<ISecretBundle[]> {
    try {
        if (!instance.clientConfig) throw Error('Failed to find client config');

        if (!instance.clientConfig.workspaceConfig) {
            instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
        }

        const secretBundles = await SecretService.getDecryptedSecrets({
            apiRequest: instance.clientConfig.apiRequest,
            workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
            workspaceId: instance.clientConfig.workspaceConfig?.workspaceId,
            environment: instance.clientConfig.workspaceConfig?.environment
        });

        secretBundles.forEach((secretBundle) => {
            const cacheKey = `${secretBundle.type}-${secretBundle.secretName}`;
            instance.cache[cacheKey] = secretBundle;
        });

        return secretBundles;

    } catch (err) {
        if (instance.debug) console.error(err);

        return [await SecretService.getFallbackSecret({
            secretName: ''
        })]
    }
}

export async function createSecretHelper(
    instance: InfisicalClient,
    secretName: string,
    secretValue: string,
    options: CreateOptions
): Promise<ISecretBundle> {
    try {
        if (!instance.clientConfig) throw Error('Failed to find client config');

        if (!instance.clientConfig.workspaceConfig) {
            instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
        }

        const secretBundle = await SecretService.createSecret({
            apiRequest: instance.clientConfig.apiRequest,
            workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
            workspaceId: instance.clientConfig.workspaceConfig?.workspaceId,
            environment: instance.clientConfig.workspaceConfig?.environment,
            type: options.type,
            secretName,
            secretValue
        });

        const cacheKey = `${options.type}-${secretName}`;
        instance.cache[cacheKey] = secretBundle;

        const shouldUpdateProcessEnv = instance.processEnvConfig && (
            !instance.bundlesLoadedToEnv[secretName] ||
            options.type === 'personal'
        )

        if (shouldUpdateProcessEnv) {
            if (
                Object.prototype.hasOwnProperty.call(process.env, secretBundle.secretName) &&
                !instance.processEnvConfig?.shouldOverride
            ) {
                instance.debug && console.log(`"${secretBundle.secretName}" is already defined in \`process.env\` and was NOT overwritten`);
            } else {
                process.env[secretName] = secretBundle.secretValue;
                instance.bundlesLoadedToEnv[secretName] = secretBundle;
            }
        }

        return secretBundle;

    } catch (err) {
        if (instance.debug) console.error(err);

        return await SecretService.getFallbackSecret({
            secretName
        })
    }
}

export async function updateSecretHelper(
    instance: InfisicalClient,
    secretName: string,
    secretValue: string,
    options: UpdateOptions
): Promise<ISecretBundle> {
    try {
        if (!instance.clientConfig) throw Error('Failed to find client config');

        if (!instance.clientConfig.workspaceConfig) {
            instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
        }

        const secretBundle = await SecretService.updateSecret({
            apiRequest: instance.clientConfig.apiRequest,
            workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
            workspaceId: instance.clientConfig.workspaceConfig?.workspaceId,
            environment: instance.clientConfig.workspaceConfig?.environment,
            type: options.type,
            secretName,
            secretValue
        });

        const cacheKey = `${options.type}-${secretName}`;
        instance.cache[cacheKey] = secretBundle;

        const shouldUpdateProcessEnv = instance.processEnvConfig && (
            (instance.bundlesLoadedToEnv[secretName].type === 'personal' && secretBundle.type === 'personal') ||
            (instance.bundlesLoadedToEnv[secretName].type === 'shared')
        )

        if (shouldUpdateProcessEnv) {
            process.env[secretName] = secretBundle.secretValue;
            instance.bundlesLoadedToEnv[secretName] = secretBundle;
        }

        return secretBundle;

    } catch (err) {
        if (instance.debug) console.error(err);

        return await SecretService.getFallbackSecret({
            secretName
        })
    }
}

export async function deleteSecretHelper(
    instance: InfisicalClient,
    secretName: string,
    options: DeleteOptions
): Promise<ISecretBundle> {
    try {
        if (!instance.clientConfig) throw Error('Failed to find client config');

        if (!instance.clientConfig.workspaceConfig) {
            instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
        }

        const secretBundle = await SecretService.deleteSecret({
            apiRequest: instance.clientConfig.apiRequest,
            workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
            workspaceId: instance.clientConfig.workspaceConfig?.workspaceId,
            environment: instance.clientConfig.workspaceConfig?.environment,
            type: options.type,
            secretName
        });

        const cacheKey = `${options.type}-${secretName}`;
        delete instance.cache[cacheKey];

        if (
            instance.processEnvConfig &&
            instance.bundlesLoadedToEnv[secretName].type === secretBundle.type
        ) {
            delete process.env[secretName];
            delete instance.bundlesLoadedToEnv[secretName];
        }

        return secretBundle;

    } catch (err) {
        if (instance.debug) console.error(err);

        return await SecretService.getFallbackSecret({
            secretName
        })
    }
}

export async function loadSecretsToEnvHelper(instance: InfisicalClient, secretBundles: ISecretBundle[]) {
    const { processEnvConfig } = instance;
    let loadedBundles: ISecretBundle[] = [];

    const addBundle = (bundleToAdd: ISecretBundle) => {

        const loadedBundle = instance.bundlesLoadedToEnv[bundleToAdd.secretName];
        if (
            Object.prototype.hasOwnProperty.call(process.env, bundleToAdd.secretName) &&
            !processEnvConfig?.shouldOverride &&
            !loadedBundle
        ) {
            console.log(`"${bundleToAdd.secretName}" is already defined in \`process.env\` and was NOT overwritten`);
            return;
        }

        if (!loadedBundle) {
            instance.bundlesLoadedToEnv[bundleToAdd.secretName] = bundleToAdd;
            process.env[bundleToAdd.secretName] = bundleToAdd.secretValue;
        }
    }

    return secretBundles.forEach(addBundle);
}
