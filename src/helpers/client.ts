import InfisicalClient from "../client/InfisicalClient";
import {
  GetAllOptions,
  GetOptions,
  CreateOptions,
  UpdateOptions,
  DeleteOptions,
  FolderOptions,
} from "../types/InfisicalClient";
import { SecretService } from "../services";
import { IFolder, ISecretBundle } from "../types/models";
import { createFolder, deleteFolder, listFolders, updateFolder } from "../api/folders";

export async function getSecretHelper(
  instance: InfisicalClient,
  secretName: string,
  options: GetOptions
): Promise<ISecretBundle> {
  const cacheKey = `${options.type}-${secretName}`;
  let cachedSecret: ISecretBundle | undefined = undefined;
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    cachedSecret = instance.cache[cacheKey];

    if (cachedSecret) {
      const currentTime = new Date();
      const cacheExpiryTime = cachedSecret.lastFetchedAt;
      cacheExpiryTime.setSeconds(cacheExpiryTime.getSeconds() + instance.clientConfig.cacheTTL);

      if (currentTime < cacheExpiryTime) {
        if (instance.debug) {
          console.log(`Returning cached secret: ${cachedSecret.secretName}`);
        }

        return cachedSecret;
      }
    }
    const secretBundle = await SecretService.getDecryptedSecret({
      apiRequest: instance.clientConfig.apiRequest,
      workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
      secretName,
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      path: options.path,
      type: options.type,
    });

    instance.cache[`${secretBundle.type}-${secretBundle.secretName}`] = secretBundle;

    return secretBundle;
  } catch (err) {
    if (instance.debug) console.error(err);

    if (cachedSecret) {
      if (instance.debug) {
        console.log(`Returning cached secret: ${cachedSecret}`);
      }

      return cachedSecret;
    }

    return await SecretService.getFallbackSecret({
      secretName,
    });
  }
}

export async function getAllSecretsHelper(instance: InfisicalClient, options: GetAllOptions): Promise<ISecretBundle[]> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const secretBundles = await SecretService.getDecryptedSecrets({
      apiRequest: instance.clientConfig.apiRequest,
      workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      path: options.path,
      includeImports: options.includeImports,
    });

    secretBundles.forEach((secretBundle) => {
      const cacheKey = `${secretBundle.type}-${secretBundle.secretName}`;
      instance.cache[cacheKey] = secretBundle;

      if (options.attachToProcessEnv) {
        process.env[secretBundle.secretName] = secretBundle.secretValue;
      }
    });

    return secretBundles;
  } catch (err) {
    if (instance.debug) console.error(err);

    return [
      await SecretService.getFallbackSecret({
        secretName: "",
      }),
    ];
  }
}

export async function createSecretHelper(
  instance: InfisicalClient,
  secretName: string,
  secretValue: string,
  options: CreateOptions
): Promise<ISecretBundle> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const secretBundle = await SecretService.createSecret({
      apiRequest: instance.clientConfig.apiRequest,
      workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      path: options.path,
      type: options.type,
      secretName,
      secretValue,
    });

    const cacheKey = `${options.type}-${secretName}`;
    instance.cache[cacheKey] = secretBundle;

    return secretBundle;
  } catch (err) {
    if (instance.debug) console.error(err);

    return await SecretService.getFallbackSecret({
      secretName,
    });
  }
}

export async function updateSecretHelper(
  instance: InfisicalClient,
  secretName: string,
  secretValue: string,
  options: UpdateOptions
): Promise<ISecretBundle> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const secretBundle = await SecretService.updateSecret({
      apiRequest: instance.clientConfig.apiRequest,
      workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      type: options.type,
      path: options.path,
      secretName,
      secretValue,
    });

    const cacheKey = `${options.type}-${secretName}`;
    instance.cache[cacheKey] = secretBundle;

    return secretBundle;
  } catch (err) {
    if (instance.debug) console.error(err);

    return await SecretService.getFallbackSecret({
      secretName,
    });
  }
}

export async function deleteSecretHelper(
  instance: InfisicalClient,
  secretName: string,
  options: DeleteOptions
): Promise<ISecretBundle> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const secretBundle = await SecretService.deleteSecret({
      apiRequest: instance.clientConfig.apiRequest,
      workspaceKey: instance.clientConfig.workspaceConfig.workspaceKey,
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      type: options.type,
      path: options.path,
      secretName,
    });

    const cacheKey = `${options.type}-${secretName}`;
    delete instance.cache[cacheKey];

    return secretBundle;
  } catch (err) {
    if (instance.debug) console.error(err);

    return await SecretService.getFallbackSecret({
      secretName,
    });
  }
}

export async function listFoldersHelper(instance: InfisicalClient, options: FolderOptions): Promise<IFolder[]> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const folders = await listFolders(instance.clientConfig.apiRequest, {
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      directory: options.directory,
    });

    return folders;
  } catch (err) {
    if (instance.debug) console.error(err);

    return [];
  }
}

export async function createFolderHelper(
  instance: InfisicalClient,
  name: string,
  options: FolderOptions
): Promise<IFolder> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const folder = await createFolder(instance.clientConfig.apiRequest, {
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      folderName: name,
      directory: options.directory,
    });

    return folder;
  } catch (err) {
    if (instance.debug) console.error(err);

    if (err instanceof Error) {
      throw err;
    } else if (typeof err === "string") {
      throw new Error(err);
    }

    throw new Error("Unhandled error");
  }
}

export async function updateFolderHelper(
  instance: InfisicalClient,
  name: string,
  newName: string,
  options: FolderOptions
): Promise<IFolder> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const updateFolderResponse = await updateFolder(instance.clientConfig.apiRequest, {
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      folderName: name,
      name: newName,
      directory: options.directory,
    });

    return updateFolderResponse.folder;
  } catch (err) {
    if (instance.debug) console.error(err);

    if (err instanceof Error) {
      throw err;
    } else if (typeof err === "string") {
      throw new Error(err);
    }

    throw new Error("Unhandled error");
  }
}

export async function deleteFolderHelper(
  instance: InfisicalClient,
  name: string,
  options: FolderOptions
): Promise<IFolder[]> {
  try {
    if (!instance.clientConfig) throw Error("Failed to find client config");

    if (!instance.clientConfig.workspaceConfig) {
      instance.clientConfig.workspaceConfig = await SecretService.populateClientWorkspaceConfig(instance.clientConfig);
    }

    const deleteFolderResponse = await deleteFolder(instance.clientConfig.apiRequest, {
      workspaceId: instance.clientConfig.workspaceConfig.workspaceId,
      environment: options.environment,
      folderName: name,
      directory: options.directory,
    });

    return deleteFolderResponse.folders;
  } catch (err) {
    if (instance.debug) console.error(err);

    if (err instanceof Error) {
      throw err;
    } else if (typeof err === "string") {
      throw new Error(err);
    }

    throw new Error("Unhandled error");
  }
}
