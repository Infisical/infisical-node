import { AuthMode } from "../variables";
import { 
    getServiceTokenData,
    getServiceTokenDataKey
} from '../api';
import { 
    decryptSymmetric128BitHexKeyUTF8,
    decryptAsymmetric
} from '../utils/crypto';
import { 
    ClientConfig,
    WorkspaceConfig
} from '../types/InfisicalClient';

export const populateClientWorkspaceConfigsHelper = async (clientConfig: ClientConfig): Promise<WorkspaceConfig> => {
    switch (clientConfig.authMode) {
        case AuthMode.SERVICE_TOKEN: {
            const serviceTokenData = await getServiceTokenData({
                apiRequest: clientConfig.apiRequest
            });

            const workspaceKey = decryptSymmetric128BitHexKeyUTF8({
                ciphertext: serviceTokenData.encryptedKey,
                iv: serviceTokenData.iv,
                tag: serviceTokenData.tag,
                key: clientConfig.credentials.serviceTokenKey
            });
            
            return ({
                workspaceId: serviceTokenData.workspace,
                workspaceKey
            });
        }
        case AuthMode.SERVICE_TOKEN_V3: {
            const {
                key: {
                    workspace,
                    encryptedKey,
                    nonce,
                    publicKey
                }
            } = await getServiceTokenDataKey({
                apiRequest: clientConfig.apiRequest
            });
            
            const workspaceKey = decryptAsymmetric({
                ciphertext: encryptedKey,
                nonce,
                publicKey,
                privateKey: clientConfig.credentials.privateKey
            });
            
            return ({
                workspaceId: workspace,
                workspaceKey
            });
        }
    }
    
    throw Error("Failed to populate workspace config");
}