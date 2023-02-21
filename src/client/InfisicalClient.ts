import { AxiosInstance } from 'axios';
import { KeyService } from '../services';
import { decryptSymmetric } from '../utils/crypto';
import { INFISICAL_URL } from '../variables';
import {
    createApiRequestWithAuthInterceptor,
    getServiceTokenData,
    getSecrets
} from '../api';
import { SecretsObj } from '../types/KeyService';
import { ClientParamType } from '../types/InfisicalClient';

export class Infisical {
    private workspaceId: string;
    private environment: string;
    private key: string;
    private apiRequest: AxiosInstance;
    private secrets: SecretsObj | null = null

    public static globalInstance: Infisical;

    constructor({ token, siteURL = INFISICAL_URL }: ClientParamType) {
        const lastDotIdx = token.lastIndexOf('.');
        const serviceToken = token.substring(0, lastDotIdx);
        const key = token.substring(lastDotIdx + 1);

        this.apiRequest = createApiRequestWithAuthInterceptor({
            baseURL: siteURL,
            serviceToken
        });
        this.key = key;
        this.workspaceId = '';
        this.environment = '';
    }
    
    /**
     * Connect to Infisical and return a new instance of Infisical
     * This method also sets up the global instance to be accessed anywhere else in an app.
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    public static async connect({ token, siteURL = INFISICAL_URL }: ClientParamType) {
        const instance = new Infisical({
            token,
            siteURL
        });
        await instance.setup();
        this.globalInstance = instance;
        return instance;
    }
    
    /**
     * Connect to Infisical and return a new instance of Infisical
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    public static async createConnection({ token, siteURL = INFISICAL_URL }: ClientParamType) {
        const instance = new Infisical({
            token,
            siteURL
        });
        await instance.setup();
        return instance;
    };
    
    /**
     * Sets up the Infisical client by getting data and secrets 
     * associated with the instance's Infisical token
     */
    public async setup() {
        try {
            // get service token data
            const serviceTokenData = await getServiceTokenData({
                apiRequest: this.apiRequest
            });

            // get secrets
            const encryptedSecrets = await getSecrets({
                apiRequest: this.apiRequest,
                workspaceId: serviceTokenData.workspace,
                environment: serviceTokenData.environment
            });

            this.workspaceId = serviceTokenData.workspace;
            this.environment = serviceTokenData.environment;

            // decrypt workspace key
            const workspaceKey = decryptSymmetric({
                ciphertext: serviceTokenData.encryptedKey,
                iv: serviceTokenData.iv,
                tag: serviceTokenData.tag,
                key: this.key
            });
            
            // decrypt secrets
            this.secrets = KeyService.decryptSecrets({
                encryptedSecrets: encryptedSecrets.secrets,
                workspaceKey
            });
        } catch (err) {
            console.log('Failed to set up the Infisical client. Please check that your token is valid.');
            console.error(err);
        }
    }

    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    public getSecret(key: string): string | undefined {
        let value;

        if (this.secrets?.[key]) {
            value = this.secrets[key];
        } else {
            value = process.env[key];
        }
        
        return value;
    }

    /**
     * Return value for secret with key [key] from global instance
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    public static getSecret(key: string): string | undefined {
        let value;
        if (!Infisical.globalInstance) {
            value = process.env[key];
        } else {
            value = Infisical.globalInstance.getSecret(key); 
        }
        
        return Infisical.globalInstance.getSecret(key);
    }
}