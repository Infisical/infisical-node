import axios from 'axios';
import { ApiRequestInterceptorProps } from '../types/api';

const createApiRequestWithAuthInterceptor = ({ baseURL, serviceToken }: ApiRequestInterceptorProps) => {
    const apiRequest = axios.create({
        baseURL,
        headers: {
            'Content-Type': ' application/json',
            'User-Agent': `InfisicalNodeSDK/1.0.18`
        }
    });

    apiRequest.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${serviceToken}`;
        return config;
    }); 

    return apiRequest;
};

export {
    createApiRequestWithAuthInterceptor
}
