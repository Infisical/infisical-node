import { AxiosInstance } from 'axios';

export interface InfisicalClientOptions {
    token?: string;
    tokenJson?: string;
    siteURL?: string;
    debug?: boolean;
    cacheTTL?: number;
}

export interface WorkspaceConfig {
    workspaceId: string;
    workspaceKey: string;
}

interface ServiceTokenCredentials {
    serviceTokenKey: string;
}

interface BaseConfig {
    apiRequest: AxiosInstance;
    cacheTTL: number;
}

export interface ServiceTokenClientConfig extends BaseConfig {
    authMode: "serviceToken"; // TODO: convert to enum
    credentials: ServiceTokenCredentials;
    workspaceConfig?: WorkspaceConfig;
}

interface ServiceTokenV3Credentials {
    publicKey: string;
    privateKey: string;
}

export interface ServiceTokenV3ClientConfig extends BaseConfig {
    authMode: "serviceTokenV3"; // TODO: convert to enum
    credentials: ServiceTokenV3Credentials;
    workspaceConfig?: WorkspaceConfig;
}

export type ClientConfig =
    | ServiceTokenClientConfig
    | ServiceTokenV3ClientConfig;

type SecretType = 'shared' | 'personal'

interface Options {
    type: SecretType;
    environment: string;
    path: string;
}

export interface GetAllOptions {
    environment: string;
    path: string;
    attachToProcessEnv: boolean;
    includeImports: boolean
}

export interface GetOptions extends Options { }
export interface CreateOptions extends Options { }
export interface UpdateOptions extends Options { }
export interface DeleteOptions extends Options { }