import { AxiosInstance } from "axios";
import { ISecret } from "./models";

export interface ApiRequestInterceptorProps {
    baseURL: string;
    serviceToken: string;
}

export interface GetSecretsDTO {
    workspaceId: string;
    environment: string;
    path: string;
    includeImports: boolean
}

export interface GetSecretDTO {
    secretName: string;
    workspaceId: string;
    environment: string;
    path: string;
    type: 'shared' | 'personal';
}

export interface CreateSecretDTO {
    secretName: string;
    workspaceId: string;
    environment: string;
    path: string;
    type: 'shared' | 'personal';
    secretKeyCiphertext: string;
    secretKeyIV: string;
    secretKeyTag: string;
    secretValueCiphertext: string;
    secretValueIV: string;
    secretValueTag: string;
    secretCommentCiphertext?: string;
    secretCommentIV?: string;
    secretCommentTag?: string;
}

export interface UpdateSecretDTO {
    secretName: string;
    workspaceId: string;
    environment: string;
    type: 'shared' | 'personal'
    path: string;
    secretValueCiphertext: string;
    secretValueIV: string;
    secretValueTag: string;
}

export interface DeleteSecretDTO {
    secretName: string;
    workspaceId: string;
    environment: string;
    path: string;
    type: 'shared' | 'personal';
}

export interface ImportedSecrets {
    environment: string;
    folderId: string;
    secretPath: string;
    secrets: ISecret[];
}

export type AllSecretsResponse = {
    secrets: ISecret[],
    imports: ImportedSecrets[]
}

export { AxiosInstance };