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

export class InfisicalClient {
    private workspaceId: string;
    private environment: string;
    private key: string;
    private apiRequest: AxiosInstance;
    private secrets: SecretsObj = {};
    private debug: boolean = false;

    constructor({ 
        token, 
        siteURL = INFISICAL_URL,
        debug = false
    }: {
        token: string;
        siteURL: string;
        debug: boolean;
    }) {
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
        this.debug = debug;
    }
    
    /**
     * Connect to Infisical and return a new instance of Infisical
     * @param {Object} options - options for connecting to Infisical
     * @param {String} token - the Infisical Token to use to connect to Infisical
     * @param {String} siteURL - the URL of Infisical to connect to
     * @returns {Promise<Infisical>} - A promise that resolves with a new instance of `Infisical`.
     */
    public static async connect({
        token,
        siteURL = INFISICAL_URL,
        attachToProcessEnv = false,
        defaultValues = {},
        debug = false
    }: {
        token: string;
        siteURL?: string;
        attachToProcessEnv?: boolean;
        defaultValues?: { [key: string]: any };
        debug?: boolean;
    }) {
        const instance = new InfisicalClient({
            token,
            siteURL,
            debug
        });

        await instance.setup({
            attachToProcessEnv,
            defaultValues
        });

        return instance;
    }
    
    /**
     * Sets up the Infisical client by getting data and secrets 
     * associated with the instance's Infisical token
     */
    public async setup({
        attachToProcessEnv = false,
        defaultValues = {}
    }: {
        attachToProcessEnv?: boolean;
        defaultValues?: { [key: string]: any };
    }) {
        try {
            this.secrets = defaultValues; 
            if (attachToProcessEnv) {
                Object.keys(defaultValues).map((defaultKey) => {
                    this.secrets[defaultKey] = defaultValues[defaultKey];
                    process.env[defaultKey] = defaultValues[defaultKey];
                });
            } else {
                Object.keys(defaultValues).map((defaultKey) => {
                    this.secrets[defaultKey] = defaultValues[defaultKey];
                });
            }

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
            const secrets = KeyService.decryptSecrets({
                encryptedSecrets: encryptedSecrets.secrets,
                workspaceKey
            });
            
            if (attachToProcessEnv) {
                // case: save secrets and add them to [process.env]
                Object.keys(secrets).map((key: string) => {
                    this.secrets[key] = secrets[key];
                    process.env[key] = secrets[key]
                });
            } else {
                // case: only save secrets
                Object.keys(secrets).map((key: string) => {
                    this.secrets[key] = secrets[key];
                });
            }
        } catch (err) {
            if (this.debug) {
                console.log('Failed to set up the Infisical client. Please ensure that your token is valid and try again.');
                console.error(err);
            }
        }
    }

    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    public getSecretValue(key: string): string | undefined {
        let value;

        if (this.secrets?.[key]) {
            value = this.secrets[key];
        } else {
            value = process.env[key];
        }
        
        return value;
    }
}