import { AxiosInstance } from 'axios';

export interface InfisicalClientOptions {
    token?: string | undefined;
    siteURL?: string;
    debug?: boolean;
    cacheTTL?: number;
}

export interface WorkspaceConfig {
    workspaceId: string;
    environment: string;
    workspaceKey: string;
}

interface ServiceTokenCredentials {
    serviceTokenKey: string;
}

interface ServiceAccountCredentials {
    serviceAccountPublicKey: string;
    serviceAccountPrivateKey: string;
}

interface ClientConfig {
    apiRequest: AxiosInstance;
    cacheTTL: number;
}

export interface ServiceTokenClientConfig extends ClientConfig {
    authMode: 'serviceToken';
    credentials: ServiceTokenCredentials;
    workspaceConfig?: WorkspaceConfig;
}

export interface ServiceAccountClientConfig extends ClientConfig {
    authMode: 'serviceAccount';
    credentials: ServiceAccountCredentials;
    workspaceConfig?: WorkspaceConfig[];
}

type SecretType = 'shared' | 'personal'

interface Options {
    type: SecretType;
}

export interface GetOptions extends Options {}
export interface CreateOptions extends Options {}
export interface UpdateOptions extends Options {}
export interface DeleteOptions extends Options {}