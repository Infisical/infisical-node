import { AxiosInstance } from 'axios';
import { ISecret } from './models';

export interface ApiRequestInterceptorProps {
	baseURL: string;
	serviceToken: string;
}

export interface GetSecretsDTO {
	workspaceId: string;
	environment: string;
	path: string;
	includeImports: boolean;
}

export interface GetSecretDTO {
	secretName: string;
	workspaceId: string;
	environment: string;
	path: string;
	type: 'shared' | 'personal';
}

export interface CreateSecretDTO {
	secretName: string;
	workspaceId: string;
	environment: string;
	path: string;
	type: 'shared' | 'personal';
	secretKeyCiphertext: string;
	secretKeyIV: string;
	secretKeyTag: string;
	secretValueCiphertext: string;
	secretValueIV: string;
	secretValueTag: string;
	secretCommentCiphertext?: string;
	secretCommentIV?: string;
	secretCommentTag?: string;
}

export interface UpdateSecretDTO {
	secretName: string;
	workspaceId: string;
	environment: string;
	type: 'shared' | 'personal';
	path: string;
	secretValueCiphertext: string;
	secretValueIV: string;
	secretValueTag: string;
}

export interface DeleteSecretDTO {
	secretName: string;
	workspaceId: string;
	environment: string;
	path: string;
	type: 'shared' | 'personal';
}

export interface ImportedSecrets {
	environment: string;
	folderId: string;
	secretPath: string;
	secrets: ISecret[];
}

export type AllSecretsResponse = {
	secrets: ISecret[];
	imports: ImportedSecrets[];
};

export interface ListFoldersDTO {
	workspaceId: string;
	environment: string;
	directory?: string;
}

export interface CreateFolderDTO {
	directory?: string;
	environment: string;
	folderName: string;
	workspaceId: string;
}

export interface UpdateFolderDTO {
	/** Name of the folder to update */
	folderName: string;
	/** New name for the folder */
	name: string;
	directory?: string;
	environment: string;
	workspaceId: string;
}

export interface DeleteFolderDTO {
	folderName: string;
	directory?: string;
	environment: string;
	workspaceId: string;
}

export { AxiosInstance };
