import "crypto"
import path from "path";
import { readPdfText } from 'pdf-text-reader';
import { open, unlink } from 'fs/promises';
import { fileURLToPath } from "url";
import { Request } from "express";

import ArticleStorage from "../repo/articleStorage.js";
import DiagramStorage from "../repo/diagramStorage.js";
import ArticleDb from "../repo/articleDb.js";
import DiagramDb from "../repo/diagramDb.js";
import ConceptMapGenerationService from "./conceptMapGeneration.js";

export default class ConceptMapUpdate{
    private diagramDb = DiagramDb.getInstance();
    private diagramStorage = DiagramStorage.getInstance();
    private articleDb = ArticleDb.getInstance();
    private articleStorage = ArticleStorage.getInstance();

    private articleId: number;
    private tempStoragePath: string;
    private tempArticleFilePath: string;
    private tempDiagramFilePath: string | null = null;
    private req: Request;

    constructor(articleId: number, req: Request){
        this.articleId = articleId;
        this.tempStoragePath = this.getTempStoragePath();
        this.tempArticleFilePath = this.getTempArticleFilePath();
        this.req = req;
    }

    private getTempStoragePath() {
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentFolder = path.dirname(currentFilePath);
        const tempStoragePath = path.resolve(currentFolder, '../../temp_files');
        return tempStoragePath;
    }

    private getTempArticleFilePath() {
        return path.join(this.tempStoragePath, this.articleId + ".pdf");
    }

    private async getArticleFromDb(){
        return await this.articleDb.getArticleById(this.articleId);
    }

    private async getArticleFromStorage(){
        const articleStorageUUID = (await this.getArticleFromDb())!.StorageArticleUUID + '.pdf';
        return await this.articleStorage.getArticle(articleStorageUUID);
    }

    private async savePdfToDisk(pdfStream: ReadableStream): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const reader = pdfStream.getReader();
                const file = await open(this.tempArticleFilePath, 'w')!;
                const writer = file.createWriteStream();
    
                let read = await reader.read();
                while (!read.done) {
                    writer.write(read.value);
                    read = await reader.read(); 
                }
                writer.end();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    private async saveDiagramToDisk(diagramStream: ReadableStream): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const reader = diagramStream.getReader();
                const file = await open(this.tempDiagramFilePath!, 'w')!;
                const writer = file.createWriteStream();
    
                let read = await reader.read();
                while (!read.done) {
                    writer.write(read.value);
                    read = await reader.read(); 
                }
                writer.end
                resolve();
            } catch (err) {
                reject(err);
            }

        })
    }

    private async getTextFromPdf(): Promise<string> {
        try {
            return await readPdfText({filePath: this.tempArticleFilePath});
        } catch (err) {
            throw new Error(err);
        }
    }

    private async saveConceptMapToDb(conceptMap: string): Promise<void> {
        await this.diagramDb.insertDiagram(this.articleId, conceptMap);
    }

    private async generateConceptMap(pdfText: string): Promise<string> {
        const conceptMapGenerationService = new ConceptMapGenerationService();
        return await conceptMapGenerationService.generate(pdfText);
    }

}