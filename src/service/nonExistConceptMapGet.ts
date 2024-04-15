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

export default class NonExistConceptMapGet{
    private diagramDb = DiagramDb.getInstance();
    private diagramStorage = DiagramStorage.getInstance();
    private articleDb = ArticleDb.getInstance();
    private articleStorage = ArticleStorage.getInstance();

    private articleId: number;
    private tempStoragePath: string;
    private tempArticleFilePath: string;
    private tempDiagramFilePath: string | null = null;

    constructor(articleId: number){
        this.articleId = articleId;
        this.tempStoragePath = this.getTempStoragePath();
        this.tempArticleFilePath = this.getTempArticleFilePath();
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
        const articleStorageUUID = (await this.getArticleFromDb())!.StorageArticleUUID;

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

    private async getTextFromPdf(): Promise<string> {
        try {
            return await readPdfText({filePath: this.tempArticleFilePath});
        } catch (err) {
            throw new Error("Error reading pdf text");
        }
    }

    private async generateConceptMap(pdfText: string): Promise<string> {
        const conceptMapGenerationService = new ConceptMapGenerationService();
        return await conceptMapGenerationService.generate(pdfText);
    }

    private async saveConceptMapToDisk(conceptMap: string): Promise<void> {
        //Save concept map to disk
        const write = await open(this.tempDiagramFilePath!, 'w');
        await write.write(conceptMap);
    }

    private generateConceptMapUUID() {
        return crypto.randomUUID();
    }

    private loadTempConceptMapFilePath(diagramUUID: string) {
        this.tempDiagramFilePath = this.tempStoragePath + diagramUUID + ".mdd";
    }

    private async writeDiagramToDb(diagramUUID: string): Promise<void> {
        await this.diagramDb.insertDiagram({
            "ArticleID": this.articleId,
            "StorageDiagramName": diagramUUID,
            "Active": true
        })
    }

    private async saveDiagramToStorage(diagramUUID: string){
        this.diagramStorage.saveDiagram(diagramUUID, this.tempDiagramFilePath!);
    }

    private removeTempPdfFileWhenReqEnd(req: Request) {
        req.on('close', async () => {
            await unlink(this.tempArticleFilePath);
        });
    }

    public async get(req: Request) {
        const pdfStream = await this.getArticleFromStorage();
        await this.savePdfToDisk(pdfStream);

        const pdfText = await this.getTextFromPdf();
        const conceptMap = await this.generateConceptMap(pdfText);

        const diagramUUID = this.generateConceptMapUUID();
        await this.saveConceptMapToDisk(conceptMap);

        await this.writeDiagramToDb(diagramUUID);
        await this.saveDiagramToStorage(diagramUUID);

        this.removeTempPdfFileWhenReqEnd(req);

        return this.tempDiagramFilePath!;
    }
}

