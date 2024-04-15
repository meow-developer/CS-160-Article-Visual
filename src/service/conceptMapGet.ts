import "crypto"
import { Request } from "express";
import ExistentConceptMapGet from "./existentConceptMapGet.js";
import NonExistConceptMapGet from "./nonExistConceptMapGet.js";
import DiagramDb from "../repo/diagramDb.js";

export default class ConceptMapGetService{
    private articleId: number;
    private diagramDb = DiagramDb.getInstance();
    private req: Request;

    constructor(articleId: number, req: Request){
        this.articleId = articleId;
        this.req = req;
    }
    
    private async checkIfConceptMapExistsInDb(): Promise<boolean> {
        const diagramCount = await this.diagramDb.countDiagramByArticleId(this.articleId);
        return diagramCount > 0;
    }

    public async get() {
        const isConceptMapExists = await this.checkIfConceptMapExistsInDb();
        if (isConceptMapExists) {
            const existentConceptMapGet = new ExistentConceptMapGet(this.articleId, this.req);
            return await existentConceptMapGet.get();
        } else {
            const nonExistConceptMapGet = new NonExistConceptMapGet(this.articleId, this.req);
            return await nonExistConceptMapGet.get();
        }
    }
}