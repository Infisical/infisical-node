import { DecryptSecrets, Secret, SecretsObj } from "../types/KeyService";
import { decryptSymmetric } from '../utils/crypto';

/**
 * Class for key-related actions
 */
export default class KeyService {
    static decryptSecrets({ encryptedSecrets, workspaceKey }: DecryptSecrets) {
        // console.log('encryptedSecrets', encryptedSecrets);
        let secretsObj: SecretsObj = {};
        
        // decrypt secret keys, values, and comments
        encryptedSecrets.forEach((encryptedSecret: Secret) => {
            const key = decryptSymmetric({
                ciphertext: encryptedSecret.secretKeyCiphertext,
                iv: encryptedSecret.secretKeyIV,
                tag: encryptedSecret.secretKeyTag,
                key: workspaceKey
            });

            const value = decryptSymmetric({
                ciphertext: encryptedSecret.secretValueCiphertext,
                iv: encryptedSecret.secretValueIV,
                tag: encryptedSecret.secretValueTag,
                key: workspaceKey
            });

            secretsObj[key] = value;
        });
        
        return secretsObj;
    }
}