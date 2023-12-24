import { INFISICAL_URL, AuthMode } from "../variables";
import { createApiRequestWithAuthInterceptor } from "../api";
import { ISecretBundle } from "../types/models";
import {
    ClientConfig,
    GetAllOptions,
    GetOptions,
    CreateOptions,
    UpdateOptions,
    DeleteOptions,
    InfisicalClientOptions
} from "../types/InfisicalClient";
import { IDecryptSymmetricInput, IEncryptSymmetricOutput } from "../types/utils";
import { getAllSecretsHelper, getSecretHelper, createSecretHelper, updateSecretHelper, deleteSecretHelper } from "../helpers/client";
import { createSymmetricKey, encryptSymmetric, decryptSymmetric } from "../utils/crypto";

class InfisicalClient {
    public cache: { [key: string]: ISecretBundle } = {};

    public clientConfig: ClientConfig | undefined = undefined;
    public debug: boolean = false;

    /**
     * Create an instance of the Infisical client
     * @param {Object} obj
     * @param {String} obj.token - an Infisical Token scoped to a project and environment
     * @param {Boolean} debug - whether debug is on
     * @param {Number} cacheTTL - time-to-live (in seconds) for refreshing cached secrets.
     */
    constructor({ token = undefined, tokenJson = undefined, siteURL = INFISICAL_URL, debug = false, cacheTTL = 300 }: InfisicalClientOptions) {
        if (token && token !== "") {
            const lastDotIdx = token.lastIndexOf(".");
            const serviceToken = token.substring(0, lastDotIdx);

            this.clientConfig = {
                authMode: AuthMode.SERVICE_TOKEN,
                credentials: {
                    serviceTokenKey: token.substring(lastDotIdx + 1)
                },
                apiRequest: createApiRequestWithAuthInterceptor({
                    baseURL: siteURL,
                    serviceToken
                }),
                cacheTTL
            };
        }

        if (tokenJson && tokenJson !== "") {
            const tokenObj = JSON.parse(tokenJson);

            this.clientConfig = {
                authMode: AuthMode.SERVICE_TOKEN_V3,
                credentials: {
                    publicKey: tokenObj.publicKey,
                    privateKey: tokenObj.privateKey
                },
                apiRequest: createApiRequestWithAuthInterceptor({
                    baseURL: siteURL,
                    serviceToken: tokenObj.serviceToken
                }),
                cacheTTL
            };
        }

        this.debug = debug;

        // We are deprecating this entire code project, so we should print a deprecation warning
        console.warn(
            "WARNING: You are using a deprecated version of the Infisical SDK. Please use the new Infisical SDK found here: https://www.npmjs.com/package/@infisical/sdk"
        );
    }

    /**
     * Return all the secrets accessible by the instance of Infisical
     */
    public async getAllSecrets(
        options: GetAllOptions = {
            environment: "dev",
            path: "/",
            attachToProcessEnv: false,
            includeImports: true
        }
    ): Promise<ISecretBundle[]> {
        return await getAllSecretsHelper(this, options);
    }

    /**
     * Return secret with name [secretName]
     * @returns {ISecretBundle} secretBundle - secret bundle
     * @param secretName name of the secret
     * @param options - secret selection options
     * @returns - a promise representing the result of the asynchronous get
     */
    public async getSecret(
        secretName: string,
        options: GetOptions = {
            type: "personal",
            environment: "dev",
            path: "/"
        }
    ): Promise<ISecretBundle> {
        return await getSecretHelper(this, secretName, options);
    }

    /**
     * Create secret with name [secretName] and value [secretValue]
     * @param secretName - name of secret to create
     * @param secretValue - value of secret to create
     * @param options - secret selection options
     * @returns - a promise representing the result of the asynchronous creation
     */
    public async createSecret(
        secretName: string,
        secretValue: string,
        options: CreateOptions = {
            environment: "dev",
            type: "shared",
            path: "/"
        }
    ): Promise<ISecretBundle> {
        return await createSecretHelper(this, secretName, secretValue, options);
    }

    /**
     * Update secret with name [secretName] and value [secretValue]
     * @param secretName - name of secret to update
     * @param secretValue - new value for secret
     * @param options - secret selection options
     * @returns - a promise representing the result of the asynchronous update
     */
    public async updateSecret(
        secretName: string,
        secretValue: string,
        options: UpdateOptions = {
            type: "shared",
            environment: "dev",
            path: "/"
        }
    ): Promise<ISecretBundle> {
        return await updateSecretHelper(this, secretName, secretValue, options);
    }

    /**
     * Delete secret with name [secretName]
     * @param secretName - name of secret to delete
     * @param options - secret selection options
     * @returns - a promise representing the result of the asynchronous deletion
     */
    public async deleteSecret(
        secretName: string,
        options: DeleteOptions = {
            environment: "dev",
            type: "shared",
            path: "/"
        }
    ): Promise<ISecretBundle> {
        return await deleteSecretHelper(this, secretName, options);
    }

    /**
     * Create a base64-encoded, 256-bit symmetric key
     * @returns {String} key - the symmetric key
     */
    public createSymmetricKey(): string {
        return createSymmetricKey();
    }

    /**
     * Encrypt the plaintext [plaintext] with the (base64) 256-bit
     * secret key [key]
     * @param plaintext
     * @param key - base64-encoded, 256-bit symmetric key
     * @returns {IEncryptSymmetricOutput} - an object containing the base64-encoded ciphertext, iv, and tag
     */
    public encryptSymmetric(plaintext: string, key: string): IEncryptSymmetricOutput {
        return encryptSymmetric({
            plaintext,
            key
        });
    }

    /**
     * Decrypt the ciphertext [ciphertext] with the (base64) 256-bit
     * secret key [key], provided [iv] and [tag]
     * @param ciphertext - base64-encoded ciphertext
     * @param key - base64-encoded, 256-bit symmetric key
     * @param iv - base64-encoded initialization vector
     * @param tag - base64-encoded authentication tag
     * @returns {String} - the decrypted [ciphertext] or cleartext
     */
    public decryptSymmetric(ciphertext: string, key: string, iv: string, tag: string): string {
        return decryptSymmetric({
            ciphertext,
            iv,
            tag,
            key
        });
    }
}

export default InfisicalClient;
