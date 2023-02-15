import { AxiosInstance } from 'axios';

const getSecrets = async ({
    apiRequest,
    workspaceId,
    environment
}: {
    apiRequest: AxiosInstance;
    workspaceId: string;
    environment: string;
}) => {
    const { data } = await apiRequest.get('/api/v2/secrets', {
        params: {
            workspaceId,
            environment
        }
    });
    return data;
}

export {
    getSecrets
}