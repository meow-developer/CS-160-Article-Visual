import { fileURLToPath } from "url";
import { open, unlink, mkdir } from 'fs/promises';
import fs from 'fs'
import path from "path";

export default class DiskStorage {
    private static instance: DiskStorage;
    private constructor(){

    }
    public static getInstance() {
        if (!DiskStorage.instance) {
            DiskStorage.instance = new DiskStorage();
            DiskStorage.instance.initTempStorage();
        }
        return DiskStorage.instance;
    }

    private async initTempStorage(){
        const tempStoragePath = this.getTempStoragePath();
        if (!fs.existsSync(tempStoragePath)) {
            await mkdir(tempStoragePath);
        }
    }
    private getTempStoragePath() {
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentFolder = path.dirname(currentFilePath);
        const tempStoragePath = path.resolve(currentFolder, '../../temp_files');
        return tempStoragePath;
    }

    private getFilePath(fileName: string) {
        return path.join(this.getTempStoragePath(), fileName);
    }

    public saveReadableStreamToDisk(fileName: string, readableStream: ReadableStream): Promise<string> {
        const filePath = this.getFilePath(fileName);

        return new Promise(async (resolve, reject) => {
            try {
                const reader = readableStream.getReader();
                const file = await open(filePath , 'w')!;
                const writer = file.createWriteStream();
    
                let read = await reader.read();
                while (!read.done) {
                    writer.write(read.value);
                    read = await reader.read(); 
                }
                writer.end();
                resolve(filePath);
            } catch (err) {
                reject(err);
            }
        });
    }

    public async saveStringToDisk(fileName: string, content: string) {
        const filePath = this.getFilePath(fileName);
        const write = await open(filePath, 'w');
        await write.write(content);
        return filePath;
    }

    public async saveByteArrayToDisk(fileName: string, byteArray: Uint8Array) {
        const filePath = this.getFilePath(fileName);
        const write = await open(filePath, 'w');
        await write.write(byteArray);
        return filePath;
    }

    public async deleteFileByFileName(fileName: string) {
        await unlink(this.getFilePath(fileName));
    }

    public async deleteFileByFilePath(filePath: string) {
        await unlink(filePath);
    }
}