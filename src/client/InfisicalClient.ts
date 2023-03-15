import { AxiosInstance } from 'axios';
import { INFISICAL_URL } from '../variables';
import {
    createApiRequestWithAuthInterceptor
} from '../api';
import { SecretsObj } from '../types/KeyService';
import SecretService from '../services/SecretService';

export class InfisicalClient {
    // definite variables
    private secrets: SecretsObj = {};
    private debug: boolean = false;

    // variables related to connecting to Infisical
    private key?: string;
    private apiRequest?: AxiosInstance;

    constructor({ 
        token, 
        siteURL = INFISICAL_URL,
        debug = false
    }: {
        token?: string | undefined;
        siteURL: string;
        debug: boolean;
    }) {
        if (token && token !== '') {
            const lastDotIdx = token.lastIndexOf('.');
            const serviceToken = token.substring(0, lastDotIdx);
            const key = token.substring(lastDotIdx + 1);

            this.apiRequest = createApiRequestWithAuthInterceptor({
                baseURL: siteURL,
                serviceToken
            });

            this.key = key;
        }

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
        debug = false
    }: {
        token?: string | undefined;
        siteURL?: string;
        attachToProcessEnv?: boolean;
        debug?: boolean;
    }) {
        const instance = new InfisicalClient({
            token,
            siteURL,
            debug
        });

        await instance.setup({
            attachToProcessEnv
        });

        return instance;
    }
    
    /**
     * Sets up the Infisical client by getting data and secrets 
     * associated with the instance's Infisical token
     */
    public async setup({
        attachToProcessEnv = false,
    }: {
        attachToProcessEnv?: boolean;
    }) {
        try {

            if (this.apiRequest && this.key) {
                // get service token data and secrets
                const { serviceTokenData, secrets } = await SecretService.getDecryptedDetails({
                    apiRequest: this.apiRequest,
                    key: this.key
                });

                // set secrets based on fetched secrets
                Object.keys(secrets).map((key) => {
                    this.secrets[key] = secrets[key];

                    if (attachToProcessEnv) {
                        process.env[key] = String(secrets[key]);
                    }
                });
            }

            console.log('Connected to Infisical');
        } catch (err) {
            if (this.debug) {
                console.error(err);
                console.error('Failed to set up the Infisical client. Please ensure that your token is valid and try again.');
            }
        }
    }

    /**
     * Return value for secret with key [key] for an instance of Infisical
     * @param {String} key - key of secret
     * @returns {String} value - value of secret
     */
    public get(key: string): string | undefined {
        let value;

        if (key in this.secrets) {
            value = this.secrets[key];
        } else {
            value = process.env[key];
        }
        
        if (value === undefined && this.debug) {
           console.warn(`Warning: Missing value for '${key}'. Please check your configuration.`);
        }
        
        return value;
    }
}