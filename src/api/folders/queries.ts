import { AxiosInstance } from 'axios';
import { CreateFolderDTO, DeleteFolderDTO, ListFoldersDTO, UpdateFolderDTO } from '../../types/api';
import { IFolder, IFolderWithVersion } from '../../types/models';

export const listFolders = async (apiRequest: AxiosInstance, options: ListFoldersDTO) => {
	const {
		data: { folders },
	} = await apiRequest.get<{ folders: IFolder[] }>('/api/v1/folders', {
		params: {
			directory: options.directory,
			workspaceId: options.workspaceId,
			environment: options.environment,
		},
	});

	return folders;
};

export const createFolder = async (apiRequest: AxiosInstance, options: CreateFolderDTO) => {
	const {
		data: { folder },
	} = await apiRequest.post<{ folder: IFolderWithVersion }>('/api/v1/folders', {
		directory: options.directory,
		environment: options.environment,
		folderName: options.folderName,
		workspaceId: options.workspaceId,
	});

	return folder;
};

export const updateFolder = async (apiRequest: AxiosInstance, options: UpdateFolderDTO) => {
	const {
		data: { folder, message },
	} = await apiRequest.patch<{ folder: IFolder; message: string }>(`/api/v1/folders/${options.folderName}`, {
		name: options.name,
		directory: options.directory,
		environment: options.environment,
		workspaceId: options.workspaceId,
	});

	return { folder, message };
};

export const deleteFolder = async (apiRequest: AxiosInstance, options: DeleteFolderDTO) => {
	const {
		data: { folders, message },
	} = await apiRequest.delete<{ folders: IFolder[]; message: string }>(`/api/v1/folders/${options.folderName}`, {
		data: {
			directory: options.directory,
			environment: options.environment,
			workspaceId: options.workspaceId,
		},
	});

	return { folders, message };
};
