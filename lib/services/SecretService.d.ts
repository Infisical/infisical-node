import { AxiosInstance } from 'axios';
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
    static getDecryptedDetails({ apiRequest, key }: {
        apiRequest: AxiosInstance;
        key: string;
    }): Promise<{
        secrets: {
            [key: string]: string;
        };
        serviceTokenData: any;
    }>;
}
