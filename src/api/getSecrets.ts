import { GetSecretsProps } from "../types/api";

const getSecrets = async ({ apiRequest, workspaceId, environment }: GetSecretsProps) => {
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