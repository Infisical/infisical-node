import { AxiosInstance } from 'axios';
import { IServiceTokenData, ServiceTokenDataKeyRes } from '../../types/models';
export declare const getServiceTokenData: ({ apiRequest }: {
    apiRequest: AxiosInstance;
}) => Promise<IServiceTokenData>;
export declare const getServiceTokenDataKey: ({ apiRequest }: {
    apiRequest: AxiosInstance;
}) => Promise<ServiceTokenDataKeyRes>;
