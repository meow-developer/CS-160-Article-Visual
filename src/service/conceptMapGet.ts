import "crypto"
import { Request } from "express";
import ExistentConceptMapGet from "./existentConceptMapGet.js";
import NonExistConceptMapGet from "./nonExistConceptMapGet.js";
import DiagramDb from "../repo/diagramDb.js";

export default class ConceptMapGetService{
    private articleId: number;
    private diagramDb = DiagramDb.getInstance();

    constructor(articleId: number){
        this.articleId = articleId;
    }
    
    private async checkIfConceptMapExistsInDb(): Promise<boolean> {
        const diagramCount = await this.diagramDb.countDiagramByArticleId(this.articleId);
        return diagramCount > 0;
    }

    public async get(req: Request) {
        const isConceptMapExists = await this.checkIfConceptMapExistsInDb();
        if (isConceptMapExists) {
            const existentConceptMapGet = new ExistentConceptMapGet(this.articleId);
            return await existentConceptMapGet.get(req);
        } else {
            const nonExistConceptMapGet = new NonExistConceptMapGet(this.articleId);
            return await nonExistConceptMapGet.get(req);
        }
    }
}