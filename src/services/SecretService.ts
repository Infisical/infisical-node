import { AxiosInstance } from 'axios';
import { 
    getServiceTokenData,
    getSecrets
} from '../api';
import { decryptSymmetric } from '../utils/crypto';
import KeyService from './KeyService';

/**
 * Class for secret-related actions
 */
export default class SecretService {
    /**
     * Return [serviceTokenData] and [secrets] unlocked by the service token on [apiRequest]
     * @param {AxiosInstance} apiRequest - an axios instance with service token bound to it.
     * @param {String} key - key parsed from the Infisical token
     * @returns 
     */
    static async getDecryptedDetails({
        apiRequest,
        key
    }: {
        apiRequest: AxiosInstance;
        key: string;
    }) {
        // get service token data
        const serviceTokenData = await getServiceTokenData({
            apiRequest
        });

        // get secrets
        const encryptedSecrets = await getSecrets({
            apiRequest,
            workspaceId: serviceTokenData.workspace,
            environment: serviceTokenData.environment
        });

        // decrypt workspace key
        const workspaceKey = decryptSymmetric({
            ciphertext: serviceTokenData.encryptedKey,
            iv: serviceTokenData.iv,
            tag: serviceTokenData.tag,
            key
        });
        
        // decrypt secrets
        const secrets = KeyService.decryptSecrets({
            encryptedSecrets: encryptedSecrets.secrets,
            workspaceKey
        });
        
        return {
            secrets,
            serviceTokenData
        }
    }
}