import { WorkSpaceDTO } from "./WorkSpaceDTO";
export interface FileItemDTO{
    id:string;
    fileName: string;
    fileType?:string;
    fileSize?: number; // Changed from fileData
    uploadedAt?: Date;
    workspaceName?: string;
    workspaceId?: string; // This is sent on upload
}

export interface FileItemDetailDto extends FileItemDTO{
    workspace?:WorkSpaceDTO;
    fileContent?: string; // For base64 file content from GetById
    uploadedByUser?: string;
}