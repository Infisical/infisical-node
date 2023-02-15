import { AxiosInstance } from 'axios';

const getServiceTokenData = async ({
    apiRequest 
}: {
    apiRequest: AxiosInstance
}) => {
    const { data } = await apiRequest.get('/api/v2/service-token');
    return data;
}

export {
    getServiceTokenData
}