export declare class Infisical {
    private workspaceId;
    private environment;
    private key;
    private apiRequest;
    private secrets;
    private static globalInstance;
    constructor({ token, siteURL, }: {
        token: string;
        siteURL?: string;
    });
    static connect({ token, siteURL, }: {
        token: string;
        siteURL?: string;
    }): Promise<Infisical>;
    static createConnection({ token, siteURL }: {
        token: string;
        siteURL?: string;
    }): Promise<void>;
    setup(): Promise<void>;
    /**
     * Return value for secret with key [key]
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    getSecret(key: string): string | undefined;
    /**
     * Return value for secret with key [key]
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    static getSecret(key: string): string | undefined;
}
