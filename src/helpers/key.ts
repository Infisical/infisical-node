import { getServiceTokenData } from '../api';
import { decryptSymmetric } from '../utils/crypto';
import { 
    ServiceTokenClientConfig, 
    ServiceTokenCredentials,
    WorkspaceConfig
} from '../types/InfisicalClient';

export const populateClientWorkspaceConfigsHelper = async (clientConfig: ServiceTokenClientConfig): Promise<WorkspaceConfig> => {
    const serviceTokenData = await getServiceTokenData({
        apiRequest: clientConfig.apiRequest
    });

    const workspaceKey = decryptSymmetric({
        ciphertext: serviceTokenData.encryptedKey,
        iv: serviceTokenData.iv,
        tag: serviceTokenData.tag,
        key: clientConfig.credentials.serviceTokenKey
    });
    
    return ({
        workspaceId: serviceTokenData.workspace,
        environment: serviceTokenData.environment,
        workspaceKey
    });
}