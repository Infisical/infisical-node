export declare class Infisical {
    private workspaceId;
    private environment;
    private key;
    private apiRequest;
    private secrets;
    static globalInstance: Infisical;
    constructor({ token, siteURL, }: {
        token: string;
        siteURL?: string;
    });
    /**
     * Connect to Infisical and return a new instance of Infisical
     * This method also sets up the global instance to be accessed anywhere else in an app.
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    static connect({ token, siteURL, }: {
        token: string;
        siteURL?: string;
    }): Promise<Infisical>;
    /**
     * Connect to Infisical and return a new instance of Infisical
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    static createConnection({ token, siteURL }: {
        token: string;
        siteURL?: string;
    }): Promise<Infisical>;
    /**
     * Sets up the Infisical client by getting data and secrets
     * associated with the instance's Infisical token
     */
    setup(): Promise<void>;
    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    getSecret(key: string): string | undefined;
    /**
     * Return value for secret with key [key] from global instance
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    static getSecret(key: string): string | undefined;
}
