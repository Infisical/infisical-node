import { GetSecretsProps } from "../types/api";
declare const getSecrets: ({ apiRequest, workspaceId, environment }: GetSecretsProps) => Promise<any>;
export { getSecrets };
