import { AxiosInstance } from 'axios';
import {
    GetSecretsDTO,
    GetSecretDTO,
    CreateSecretDTO,
    UpdateSecretDTO,
    DeleteSecretDTO,
    AllSecretsResponse
} from '../../types/api';
import { ISecret } from '../../types/models';

export const getSecrets = async (apiRequest: AxiosInstance, options: GetSecretsDTO) => {
    const { data: { secrets, imports } } = await apiRequest.get<AllSecretsResponse>(
        '/api/v3/secrets', {
        params: {
            workspaceId: options.workspaceId,
            environment: options.environment,
            secretPath: options.path,
            include_imports: options.includeImports
        }
    });

    return {
        secrets: secrets ? secrets : [],
        imports: imports ? imports : []
    };
}

export const getSecret = async (apiRequest: AxiosInstance, options: GetSecretDTO) => {
    const { data: { secret } } = await apiRequest.get<{ secret: ISecret }>(
        `/api/v3/secrets/${options.secretName}`, {
        params: {
            workspaceId: options.workspaceId,
            environment: options.environment,
            type: options.type,
            secretPath: options.path
        }
    });

    return secret;
}

export const createSecret = async (apiRequest: AxiosInstance, options: CreateSecretDTO) => {
    const { data: { secret } } = await apiRequest.post<{ secret: ISecret }>(
        `/api/v3/secrets/${options.secretName}`, {
        workspaceId: options.workspaceId,
        environment: options.environment,
        type: options.type,
        secretKeyCiphertext: options.secretKeyCiphertext,
        secretKeyIV: options.secretKeyIV,
        secretKeyTag: options.secretKeyTag,
        secretValueCiphertext: options.secretValueCiphertext,
        secretValueIV: options.secretValueIV,
        secretValueTag: options.secretValueTag,
        secretPath: options.path
    });

    return secret;
}

export const updateSecret = async (apiRequest: AxiosInstance, options: UpdateSecretDTO) => {
    const { data: { secret } } = await apiRequest.patch<{ secret: ISecret }>(
        `/api/v3/secrets/${options.secretName}`, {
        workspaceId: options.workspaceId,
        environment: options.environment,
        type: options.type,
        secretValueCiphertext: options.secretValueCiphertext,
        secretValueIV: options.secretValueIV,
        secretValueTag: options.secretValueTag
    }
    );

    return secret;
}

export const deleteSecret = async (apiRequest: AxiosInstance, options: DeleteSecretDTO) => {
    const { data: { secret } } = await apiRequest.delete<{ secret: ISecret }>(
        `/api/v3/secrets/${options.secretName}`, {
        data: {
            workspaceId: options.workspaceId,
            environment: options.environment,
            type: options.type,
            secretPath: options.path
        }
    }
    );

    return secret;
}