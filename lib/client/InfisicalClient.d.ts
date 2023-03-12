export declare class InfisicalClient {
    private workspaceId;
    private environment;
    private key;
    private apiRequest;
    private secrets;
    constructor({ token, siteURL }: {
        token: string;
        siteURL: string;
    });
    /**
     * Connect to Infisical and return a new instance of Infisical
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    static connect({ token, siteURL, attachToProcessEnv, defaultValues }: {
        token: string;
        siteURL?: string;
        attachToProcessEnv?: boolean;
        defaultValues?: {
            [key: string]: string;
        };
    }): Promise<InfisicalClient>;
    /**
     * Sets up the Infisical client by getting data and secrets
     * associated with the instance's Infisical token
     */
    setup({ attachToProcessEnv, defaultValues }: {
        attachToProcessEnv?: boolean;
        defaultValues?: {
            [key: string]: string;
        };
    }): Promise<void>;
    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    getSecretValue(key: string): string | undefined;
}
