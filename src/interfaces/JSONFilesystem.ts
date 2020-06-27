import { FileContentItem } from "@interfaces/Filesystem";

export interface JSONFilesystem {
	getJsonFileContent(path: string): Promise<any>;
	createJsonFile(path: string, content: any): Promise<any>;
	updateJsonFile(path: string, content: any): Promise<any>;
	getFolderContent(path?: string): Promise<Array<FileContentItem>>;
	deleteFolder(path?: string): Promise<any>;
	deleteFile(path: string): Promise<any>;
}