import { readPdfText } from 'pdf-text-reader';

import ArticleStorage from "../repo/articleStorage.js";
import ArticleDb from "../repo/articleDb.js";
import diskStorage from '../repo/diskStorage.js';

export default class ArticleTextGet {
    private articleId: number;

    private articleDb = ArticleDb.getInstance();
    private articleStorage = ArticleStorage.getInstance();
    private diskStorage = diskStorage.getInstance();

    constructor(articleId: number){
        this.articleId = articleId;
    }

    private async getArticleStorageUUIDFromDb(){
        const uuid = (await this.articleDb.getArticleById(this.articleId))?.StorageArticleUUID;
        return uuid!;
    }

    private async getArticleFromStorage(articleStorageUUID: string): Promise<Uint8Array>{
        return await this.articleStorage.getArticle(articleStorageUUID + ".pdf");
    }

    private async savePdfToDisk(articleStorageUUID: string, pdfFileByteArray: Uint8Array): Promise<string> {
        const fileName = articleStorageUUID + ".pdf";
        const filePath = await this.diskStorage.saveByteArrayToDisk(fileName, pdfFileByteArray);
        return filePath;
    }

    private async getTextFromPdf(filePath: string): Promise<string> {
        try {
            return await readPdfText({filePath: filePath});
        } catch (err) {
            throw new Error("Error reading pdf text");
        }
    }

    private async deletePdfFromDisk(filePath: string) {
        await this.diskStorage.deleteFileByFilePath(filePath);
    }

    public async get() {
        const articleStorageUUID = await this.getArticleStorageUUIDFromDb();
        const pdfFileByteArray = await this.getArticleFromStorage(articleStorageUUID);
        const filePath = await this.savePdfToDisk(articleStorageUUID, pdfFileByteArray);
        const text = await this.getTextFromPdf(filePath);

        await this.deletePdfFromDisk(filePath);

        return text;
    }
}