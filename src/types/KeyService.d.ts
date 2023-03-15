import { Secret } from '../types/models';

export interface DecryptSecrets {
    encryptedSecrets: Secret[];
    workspaceKey: string;
}

export interface SecretsObj {
    [key: string]: string;
}

export { Secret };
