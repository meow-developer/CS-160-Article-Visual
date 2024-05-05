import "crypto"
import { Request } from "express";

import DiagramStorage from "../repo/diagramStorage.js";
import DiagramDb from "../repo/diagramDb.js";
import ConceptMapGenerationService from "./ChatGpt/conceptMapGeneration.js";
import ArticleTextGet from "./articleTextGet.js";
import DiskStorage from "../repo/diskStorage.js";

export default class NonExistConceptMapGet{
    private diagramDb = DiagramDb.getInstance();
    private diagramStorage = DiagramStorage.getInstance();
    private diskStorage = DiskStorage.getInstance();

    private articleId: number;
    private req: Request;

    constructor(articleId: number, req: Request){
        this.articleId = articleId;
        this.req = req;
    }

    private async getArticleFromStorage(){
        const articleTextGet = new ArticleTextGet(this.articleId);
        return await articleTextGet.get();
    }

    private async generateConceptMap(pdfText: string): Promise<string> {
        const conceptMapGenerationService = new ConceptMapGenerationService();
        return await conceptMapGenerationService.generate(pdfText);
    }

    private generateConceptMapUUID() {
        return crypto.randomUUID();
    }

    private async saveConceptMapToDisk(diagramUUID: string, conceptMap: string): Promise<string> {
        const fileName = diagramUUID + ".mmd";
        return await this.diskStorage.saveStringToDisk(fileName, conceptMap);
    }

    private async writeDiagramToDb(diagramUUID: string): Promise<void> {
        await this.diagramDb.insertDiagram({
            "ArticleID": this.articleId,
            "StorageDiagramName": diagramUUID,
            "Active": true
        })
    }

    private async saveDiagramToStorage(diagramUUID: string, filePath: string){
        this.diagramStorage.saveDiagram(diagramUUID, filePath);
    }

    private deleteTempFileWhenReqEnds(filePath: string){
        this.req.on("close", async () => {
            await this.diskStorage.deleteFileByFilePath(filePath);
        });
    }

    public async get() {
        const pdfText = await this.getArticleFromStorage();
        const conceptMap = await this.generateConceptMap(pdfText);

        const diagramUUID = this.generateConceptMapUUID();
        const filePath = await this.saveConceptMapToDisk(diagramUUID, conceptMap);

        await this.writeDiagramToDb(diagramUUID);
        await this.saveDiagramToStorage(diagramUUID, filePath);

        this.deleteTempFileWhenReqEnds(filePath);

        return filePath;
    }
}

