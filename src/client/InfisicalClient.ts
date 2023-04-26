import NodeCache from 'node-cache';
import { INFISICAL_URL, AUTH_MODE_SERVICE_TOKEN } from '../variables';
import { createApiRequestWithAuthInterceptor } from '../api';
import { ISecretBundle } from '../types/models';
import { 
    ServiceTokenClientConfig,
    GetOptions,
    CreateOptions,
    UpdateOptions,
    DeleteOptions
} from '../types/InfisicalClient';
import {
    getAllSecretsHelper,
    getSecretHelper,
    createSecretHelper,
    updateSecretHelper,
    deleteSecretHelper
} from '../helpers/client';

export class InfisicalClient {

    public cacheConfig: {
        cache: NodeCache;
    }

    public clientConfig: ServiceTokenClientConfig | undefined = undefined;
    public debug: boolean = false;
    
    /**
     * Create an instance of the Infisical client
     * @param {Object} obj
     * @param {String} obj.token - an Infisical Token scoped to a project and environment
     * @param {Boolean} debug - whether or not debug is on
     * @param {Number} cacheTTL - time-to-live (in seconds) for refreshing cached secrets.
     */
    constructor({
        token, 
        siteURL = INFISICAL_URL,
        debug = false,
        cacheTTL = 300
    }: {
        token?: string | undefined;
        siteURL: string;
        debug: boolean;
        cacheTTL?: number;
    }) {
        if (token && token !== '') {
            const lastDotIdx = token.lastIndexOf('.');
            const serviceToken = token.substring(0, lastDotIdx);
            
            this.clientConfig = {
                authMode: AUTH_MODE_SERVICE_TOKEN,
                credentials: {
                    serviceTokenKey: token.substring(lastDotIdx + 1)
                },
                apiRequest: createApiRequestWithAuthInterceptor({
                    baseURL: siteURL,
                    serviceToken
                }),
                cacheTTL
            }
        }
        
        this.cacheConfig = {
            cache: new NodeCache()
        }

        this.debug = debug;
    }
    
     /**
     * Return all the secrets accessible by the instance of Infisical
     */
    public async getAllSecrets(): Promise<ISecretBundle[]> {
        return await getAllSecretsHelper(this);
     }

    /**
     * Return secret with name [secretName]
     * @param {String} key - key of secret
     * @returns {ISecretBundle} secretBundle - secret bundle
     */
    public async getSecret(
        secretName: string, 
        options: GetOptions = {
            type: 'personal'
        }
    ): Promise<ISecretBundle> {
        return await getSecretHelper(this, secretName, options);
    }
    
    /**
     * Create secret with name [secretName] and value [secretValue]
     * @param secretName - name of secret to create
     * @param secretValue - value of secret to create
     * @param options
     * @returns 
     */
    public async createSecret(
        secretName: string, 
        secretValue: string, 
        options: CreateOptions = {
            type: 'shared'
        }
    ): Promise<ISecretBundle> {
        return await createSecretHelper(this, secretName, secretValue, options);
    }

    /**
     * Update secret with name [secretName] and value [secretValue]
     * @param secretName - name of secret to update
     * @param secretValue - new value for secret
     * @param options 
     * @returns 
     */
    public async updateSecret(
        secretName: string,
        secretValue: string,
        options: UpdateOptions = {
            type: 'shared'
        }
    ): Promise<ISecretBundle> {
        return await updateSecretHelper(this, secretName, secretValue, options);
    }

    /**
     * Delete secret with name [secretName]
     * @param secretName - name of secret to delete
     * @param options 
     * @returns 
     */
    public async deleteSecret(
        secretName: string,
        options: DeleteOptions = {
            type: 'shared'
        }
    ): Promise<ISecretBundle> {
        return await deleteSecretHelper(this, secretName, options);
    }
}
