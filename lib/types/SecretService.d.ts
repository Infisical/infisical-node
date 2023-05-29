import { AxiosInstance } from 'axios';
import { GetSecretsDTO, GetSecretDTO, DeleteSecretDTO } from './api';
export interface GetFallbackSecretParams {
    secretName: string;
}
export interface GetDecryptedSecretsParams extends GetSecretsDTO {
    apiRequest: AxiosInstance;
    workspaceKey: string;
}
export interface GetDecryptedSecretParams extends GetSecretDTO {
    apiRequest: AxiosInstance;
    workspaceKey: string;
}
export interface CreateSecretParams {
    apiRequest: AxiosInstance;
    workspaceKey: string;
    workspaceId: string;
    environment: string;
    type: 'shared' | 'personal';
    secretName: string;
    secretValue: string;
}
export interface UpdateSecretParams {
    apiRequest: AxiosInstance;
    workspaceKey: string;
    workspaceId: string;
    environment: string;
    type: 'shared' | 'personal';
    secretName: string;
    secretValue: string;
}
export interface DeleteSecretParams extends DeleteSecretDTO {
    apiRequest: AxiosInstance;
    workspaceKey: string;
}
