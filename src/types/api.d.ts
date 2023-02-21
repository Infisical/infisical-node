import { AxiosInstance } from "axios";

export interface ApiRequestInterceptorProps {
    baseURL: string;
    serviceToken: string;
}

export interface GetSecretsProps {
    apiRequest: AxiosInstance;
    workspaceId: string;
    environment: string;
}

export { AxiosInstance };

