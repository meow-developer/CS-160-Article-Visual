import { readPdfText } from 'pdf-text-reader';
import { fileURLToPath } from "url";
import path from "path";

import ArticleStorage from "../repo/articleStorage.js";
import ArticleDb from "../repo/articleDb.js";
import DiskStorage from '../repo/diskStorage.js';

export default class ArticleTextGet {
    private articleId: number;

    private articleDb = ArticleDb.getInstance();
    private articleStorage = ArticleStorage.getInstance();

    constructor(articleId: number){
        this.articleId = articleId;
    }

    private async getArticleStorageUUIDFromDb(){
        const uuid = (await this.articleDb.getArticleById(this.articleId))?.StorageArticleUUID;
        return uuid;
    }

    private async getArticleFromStorage(){
        const articleStorageUUID = await this.getArticleStorageUUIDFromDb();
        return await this.articleStorage.getArticle(articleStorageUUID + ".pdf");
    }

    private async savePdfToDisk(pdfStream: ReadableStream): Promise<string> {
        const fileName = this.articleId + ".pdf";
        const filePath = await DiskStorage.saveReadableStreamToDisk(fileName, pdfStream);
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
        await DiskStorage.deleteFileByFilePath(filePath);
    }

    public async get() {
        const pdfStream = await this.getArticleFromStorage();
        const filePath = await this.savePdfToDisk(pdfStream);
        const text = await this.getTextFromPdf(filePath);

        await this.deletePdfFromDisk(filePath);

        return text;
    }
}