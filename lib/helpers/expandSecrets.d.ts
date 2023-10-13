import { AxiosInstance } from "../types/api";
export declare const expandSecrets: (workspaceId: string, workspaceKey: string, apiRequest: AxiosInstance, environment: string, secretPath: string, secrets: Record<string, {
    value: string;
    comment?: string;
    skipMultilineEncoding?: boolean;
}>, includeImports?: boolean) => Promise<Record<string, {
    value: string;
    comment?: string | undefined;
    skipMultilineEncoding?: boolean | undefined;
}>>;
