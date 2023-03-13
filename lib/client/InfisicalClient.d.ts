import { IConfig } from '../interfaces/client';
export declare class InfisicalClient {
    private workspaceId;
    private environment;
    private key;
    private apiRequest;
    private secrets;
    private debug;
    private config;
    constructor({ token, siteURL, debug }: {
        token: string;
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
    static connect({ token, siteURL, attachToProcessEnv, config, debug }: {
        token: string;
        siteURL?: string;
        attachToProcessEnv?: boolean;
        config?: IConfig;
        debug?: boolean;
    }): Promise<InfisicalClient>;
    /**
     * Sets up the Infisical client by getting data and secrets
     * associated with the instance's Infisical token
     */
    setup({ attachToProcessEnv, config }: {
        attachToProcessEnv?: boolean;
        config?: IConfig;
    }): Promise<void>;
    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    get<T extends keyof IConfig>(key: T): string | number | boolean | Date | undefined;
}
