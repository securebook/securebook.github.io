import { Filesystem } from "@interfaces/Filesystem";

export interface EncryptedFilesystem extends Filesystem {
	getJsonFileContent(path: string): Promise<any>;
	createJsonFile(path: string, content: any): Promise<any>;
	updateJsonFile(path: string, content: any): Promise<any>;
}