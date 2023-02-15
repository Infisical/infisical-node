declare const createApiRequestWithAuthInterceptor: ({ baseURL, serviceToken }: {
    baseURL: string;
    serviceToken: string;
}) => import("axios").AxiosInstance;
export { createApiRequestWithAuthInterceptor };
