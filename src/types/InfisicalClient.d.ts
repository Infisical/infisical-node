import { AxiosInstance } from 'axios';

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

export interface GetOptions {
    type: 'shared' | 'personal';
}

export interface CreateOptions {
    type: 'shared' | 'personal'
}

export interface UpdateOptions {
    type: 'shared' | 'personal'
}

export interface DeleteOptions {
    type: 'shared' | 'personal'
}