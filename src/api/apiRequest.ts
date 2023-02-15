import axios from 'axios';

const createApiRequestWithAuthInterceptor = ({
    baseURL,
    serviceToken
}: {
    baseURL: string;
    serviceToken: string;
}) => {
    const apiRequest = axios.create({
        baseURL,
        headers: {
            'Content-Type': ' application/json'
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
