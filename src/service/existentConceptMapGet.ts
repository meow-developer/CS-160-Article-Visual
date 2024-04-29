import "crypto"
import { Request } from "express";

import DiagramStorage from "../repo/diagramStorage.js";
import DiagramDb from "../repo/diagramDb.js";
import DiskStorage from "../repo/diskStorage.js";

export default class ExistentConceptMapGet{
    private diagramStorage = DiagramStorage.getInstance();
    private diagramDb = DiagramDb.getInstance();

    private articleId: number;
    private req: Request;
    
    constructor(articleId: number, req: Request){
        this.articleId = articleId;
        this.req = req;
    }

    private async getConceptMapUUIDFromDb(): Promise<string> {
        const diagram = await this.diagramDb.getDiagramByArticleId(this.articleId);
        return diagram!.StorageDiagramUUID;
    }

    private async getConceptMapFromStorage(diagramUUID: string): Promise<ReadableStream> {
        return (await this.diagramStorage.getDiagram(diagramUUID))!;
    }

    private async saveDiagramToDisk(diagramUUID: string, diagramStream: ReadableStream): Promise<string> {
        const fileName = diagramUUID + ".mdd";
        const filePath = await DiskStorage.saveReadableStreamToDisk(fileName, diagramStream);

        return filePath;
    }

    private removeTempDiagramFileWhenReqEnd(filePath: string) {
        this.req.on('close', async () => {
            await DiskStorage.deleteFileByFilePath(filePath);
        });
    }

    public async get() {
        const diagramUUID = await this.getConceptMapUUIDFromDb();
        const diagramStream = await this.getConceptMapFromStorage(diagramUUID);
        const filePath = await this.saveDiagramToDisk(diagramUUID, diagramStream);

        this.removeTempDiagramFileWhenReqEnd(filePath);
        return filePath;
    }
}