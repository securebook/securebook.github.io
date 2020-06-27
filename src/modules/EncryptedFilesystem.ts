import { JSONFilesystem } from '@interfaces/JSONFilesystem';
import { Filesystem } from '@interfaces/Filesystem';
import { Password } from '@interfaces/Password';
import { Crypter } from '@interfaces/Crypter';
import { PasswordIncorrect } from '@errors/PasswordIncorrect';

export class EncryptedFilesystem implements JSONFilesystem {
	private readonly filesystem: Filesystem;
	private readonly password: Password;
	private readonly crypter: Crypter;
	
	constructor(filesystem: Filesystem, password: Password, crypter: Crypter) {
		this.filesystem = filesystem;
		this.password = password;
		this.crypter = crypter;
	}

	async getJsonFileContent(path: string) {
		const content = await this.getFileContent(path);
		try {
			const result = JSON.parse(content);
			this.password.status = 'verified';
			return result;
		}
		catch(e) {
			this.password.status = 'incorrect';
			throw new PasswordIncorrect();
		}
	}

	async createJsonFile(path: string, content: any) {
		await this.createFile(path, JSON.stringify(content));
		this.password.status = 'verified';
	}

	async updateJsonFile(path: string, content: any) {
		await this.updateFile(path, JSON.stringify(content));
		this.password.status = 'verified';
	}

	async getFileContent(path: string) {
		return await this.crypter.decrypt(await this.filesystem.getFileContent(path), this.password.hash);
	}

	async createFile(path: string, content: string) {
		return await this.filesystem.createFile(path, await this.crypter.encrypt(content, this.password.hash));
	}

	async updateFile(path: string, content: string) {
		return await this.filesystem.updateFile(path, await this.crypter.encrypt(content, this.password.hash));
	}

	async deleteFile(path: string) {
		return await this.filesystem.deleteFile(path);
	}

	async getFolderContent(path?: string) {
		return await this.filesystem.getFolderContent(path);
	}

	async deleteFolder(path?: string) {
		return await this.filesystem.deleteFolder(path);
	}
}