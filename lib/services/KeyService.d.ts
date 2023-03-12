import { DecryptSecrets, SecretsObj } from "../types/KeyService";
/**
 * Class for key-related actions
 */
export default class KeyService {
    static decryptSecrets({ encryptedSecrets, workspaceKey }: DecryptSecrets): SecretsObj;
}
