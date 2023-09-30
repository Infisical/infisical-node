import { AxiosInstance } from 'axios';
import { 
    IServiceTokenData,
    ServiceTokenDataKeyRes
} from '../../types/models';

export const getServiceTokenData = async ({
    apiRequest 
}: {
    apiRequest: AxiosInstance;
}): Promise<IServiceTokenData> => {
    const { data } = await apiRequest.get<IServiceTokenData>('/api/v2/service-token');
    return data;
}

export const getServiceTokenDataKey = async ({
    apiRequest
}: {
    apiRequest: AxiosInstance;
}): Promise<ServiceTokenDataKeyRes> => {
    const { data } = await apiRequest.get<ServiceTokenDataKeyRes>("/api/v3/service-token/me/key");
    return data
}
