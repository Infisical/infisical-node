import { SecretsObj } from '../types/KeyService';
export declare class InfisicalClient {
    private secrets;
    private debug;
    private key?;
    private apiRequest?;
    constructor({ token, siteURL, debug }: {
        token?: string | undefined;
        siteURL: string;
        debug: boolean;
    });
    /**
     * Connect to Infisical and return a new instance of Infisical
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    static connect({ token, siteURL, attachToProcessEnv, debug }: {
        token?: string | undefined;
        siteURL?: string;
        attachToProcessEnv?: boolean;
        debug?: boolean;
    }): Promise<InfisicalClient>;
    /**
     * Sets up the Infisical client by getting data and secrets
     * associated with the instance's Infisical token
     */
    setup({ attachToProcessEnv, }: {
        attachToProcessEnv?: boolean;
    }): Promise<void>;
    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    get(key: string): string | undefined;
    /**
    * Returns all the secret keys for an instance of Infisical
    * @returns {SecretsObj} - object of all secret keys
    */
    getAll(): SecretsObj;
}
