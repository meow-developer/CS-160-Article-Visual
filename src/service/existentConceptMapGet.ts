import path from "path";
import "crypto"
import { open, unlink } from 'fs/promises';
import { fileURLToPath } from "url";
import { Request } from "express";

import DiagramStorage from "../repo/diagramStorage.js";
import DiagramDb from "../repo/diagramDb.js";

export default class ExistentConceptMapGet{
    private diagramStorage = DiagramStorage.getInstance();
    private diagramDb = DiagramDb.getInstance();
    private tempStoragePath: string;

    private articleId: number;
    constructor(articleId: number){
        this.articleId = articleId;
        this.tempStoragePath = this.getTempDiagramFilePath();
    }

    private async getConceptMapUUIDFromDb(): Promise<string> {
        const diagram = await this.diagramDb.getDiagramByArticleId(this.articleId);
        return diagram!.StorageDiagramUUID;
    }

    private async getConceptMapFromStorage(diagramUUID: string): Promise<ReadableStream> {
        return (await this.diagramStorage.getDiagram(diagramUUID))!;
    }

    private async saveDiagramToDisk(diagramStream: ReadableStream): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const reader = diagramStream.getReader();
                const file = await open(this.tempStoragePath, 'w')!;
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

    private getTempDiagramFilePath() {
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentFolder = path.dirname(currentFilePath);
        const tempStoragePath = path.resolve(currentFolder, '../../temp_files');
        
        return path.join(tempStoragePath, this.articleId + ".mdd");
    }

    private removeTempDiagramFileWhenReqEnd(req: Request) {
        req.on('close', async () => {
            await unlink(this.tempStoragePath);
        });
    }

    public async get(req: Request) {
        const diagramUUID = await this.getConceptMapUUIDFromDb();
        const diagramStream = await this.getConceptMapFromStorage(diagramUUID);
        await this.saveDiagramToDisk(diagramStream);
        this.removeTempDiagramFileWhenReqEnd(req);
        return this.tempStoragePath;
    }
}