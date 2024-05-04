import "crypto"
import { Request } from "express";

import DiagramStorage from "../repo/diagramStorage.js";
import DiagramDb from "../repo/diagramDb.js";
import ConceptMapGenerationService from "./ChatGpt/conceptMapGeneration.js";
import ArticleTextGet from "./articleTextGet.js";
import DiskStorage from "../repo/diskStorage.js";

export default class ConceptMapUpdate{
    private articleId: number;
    private req: Request;

    constructor(articleId: number, req: Request){
        this.articleId = articleId;
        this.req = req;
    }

    private async getArticleDiagramUUIDFromDb(){
        const diagramDb = DiagramDb.getInstance();
        const diagramUUID = (await diagramDb.getDiagramByArticleId(this.articleId))?.StorageDiagramUUID;
        return diagramUUID!;
    }

    private async getArticleTextFromStorage(){
        const articleTextGet = new ArticleTextGet(this.articleId);
        return await articleTextGet.get();
    }

    private async generateConceptMap(pdfText: string): Promise<string> {
        const conceptMapGenerationService = new ConceptMapGenerationService();
        return await conceptMapGenerationService.generate(pdfText);
    }

    private async saveConceptMapToDisk(diagramUUID: string, conceptMap: string): Promise<string> {
        const fileName = diagramUUID + ".mmd";
        return await DiskStorage.saveStringToDisk(fileName, conceptMap);
    }
    private async saveDiagramToStorage(diagramUUID: string, filePath: string){
        const diagramStorage = DiagramStorage.getInstance();
        await diagramStorage.saveDiagram(diagramUUID, filePath);
    }
    private deleteTempFileWhenReqEnds(filePath: string){
        this.req.on("close", async () => {
            await DiskStorage.deleteFileByFilePath(filePath);
        });
    }
    public async update(){
        const diagramUUID = await this.getArticleDiagramUUIDFromDb();
        const articleText = await this.getArticleTextFromStorage();
        const conceptMap = await this.generateConceptMap(articleText);
        const filePath = await this.saveConceptMapToDisk(diagramUUID, conceptMap);

        await this.saveDiagramToStorage(diagramUUID, filePath);

        this.deleteTempFileWhenReqEnds(filePath);
        return filePath;
    }
}