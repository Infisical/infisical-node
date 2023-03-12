import axios from 'axios';
import { ApiRequestInterceptorProps } from '../types/api';
import packageJSON from '../../package.json';

const createApiRequestWithAuthInterceptor = ({ baseURL, serviceToken }: ApiRequestInterceptorProps) => {
    const apiRequest = axios.create({
        baseURL,
        headers: {
            'Content-Type': ' application/json',
            'User-Agent': `InfisicalNodeSDK/${packageJSON.version}`
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
