import NodeCache from 'node-cache';
import { ISecretBundle } from '../types/models';
import { ServiceTokenClientConfig, GetOptions, CreateOptions, UpdateOptions, DeleteOptions } from '../types/InfisicalClient';
declare class InfisicalClient {
    cacheConfig: {
        cache: NodeCache;
    };
    clientConfig: ServiceTokenClientConfig | undefined;
    debug: boolean;
    /**
     * Create an instance of the Infisical client
     * @param {Object} obj
     * @param {String} obj.token - an Infisical Token scoped to a project and environment
     * @param {Boolean} debug - whether or not debug is on
     * @param {Number} cacheTTL - time-to-live (in seconds) for refreshing cached secrets.
     */
    constructor({ token, siteURL, debug, cacheTTL }: {
        token?: string | undefined;
        siteURL?: string;
        debug?: boolean;
        cacheTTL?: number;
    });
    /**
    * Return all the secrets accessible by the instance of Infisical
    */
    getAllSecrets(): Promise<ISecretBundle[]>;
    /**
     * Return secret with name [secretName]
     * @param {String} key - key of secret
     * @returns {ISecretBundle} secretBundle - secret bundle
     */
    getSecret(secretName: string, options?: GetOptions): Promise<ISecretBundle>;
    /**
     * Create secret with name [secretName] and value [secretValue]
     * @param secretName - name of secret to create
     * @param secretValue - value of secret to create
     * @param options
     * @returns
     */
    createSecret(secretName: string, secretValue: string, options?: CreateOptions): Promise<ISecretBundle>;
    /**
     * Update secret with name [secretName] and value [secretValue]
     * @param secretName - name of secret to update
     * @param secretValue - new value for secret
     * @param options
     * @returns
     */
    updateSecret(secretName: string, secretValue: string, options?: UpdateOptions): Promise<ISecretBundle>;
    /**
     * Delete secret with name [secretName]
     * @param secretName - name of secret to delete
     * @param options
     * @returns
     */
    deleteSecret(secretName: string, options?: DeleteOptions): Promise<ISecretBundle>;
}
export default InfisicalClient;
