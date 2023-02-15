import { AxiosInstance } from 'axios';
declare const getSecrets: ({ apiRequest, workspaceId, environment }: {
    apiRequest: AxiosInstance;
    workspaceId: string;
    environment: string;
}) => Promise<any>;
export { getSecrets };
