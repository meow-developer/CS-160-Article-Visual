import { fileURLToPath } from "url";
import { open, unlink } from 'fs/promises';
import path from "path";

export default class DiskStorage {
    private static getTempStoragePath() {
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentFolder = path.dirname(currentFilePath);
        const tempStoragePath = path.resolve(currentFolder, '../../temp_files');
        return tempStoragePath;
    }

    private static getFilePath(fileName: string) {
        return path.join(this.getTempStoragePath(), fileName);
    }

    public static saveReadableStreamToDisk(fileName: string, readableStream: ReadableStream): Promise<string> {
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

    public static async saveStringToDisk(fileName: string, content: string) {
        const filePath = this.getFilePath(fileName);
        const write = await open(filePath, 'w');
        await write.write(content);
        return filePath;
    }

    public static async deleteFileByFileName(fileName: string) {
        await unlink(this.getFilePath(fileName));
    }

    public static async deleteFileByFilePath(filePath: string) {
        await unlink(filePath);
    }
}