import { Secret } from "../types/models";
/**
 * Class for key-related actions
 */
export default class KeyService {
    static decryptSecrets({ encryptedSecrets, workspaceKey }: {
        encryptedSecrets: Secret[];
        workspaceKey: string;
    }): {
        [key: string]: string;
    };
}
