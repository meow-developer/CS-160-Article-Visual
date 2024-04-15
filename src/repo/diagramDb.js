import { Prisma, PrismaClient } from '@prisma/client'

class DiagramDb {
    /**
     * @type {DiagramDb}
     */
    static instance;
    db;

    constructor() {
        this.db = new PrismaClient()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DiagramDb();
        }
        return this.instance;
    }

    /**
     * @param {any} articleId
     */
    async getDiagramById(articleId) {
        const diagram = await this.db.diagram.findUnique({
            "where": {
                "ArticleID": articleId
            }
        });
        return diagram;
    }


    /**
     * @param {{ ArticleID: number; StorageDiagramName: import('crypto').UUID | string; Active: boolean; }} diagramData
     */
    async insertDiagram(diagramData) {
        const diagramCreate = await this.db.diagram.create({
            "data": {
                "StorageDiagramName": diagramData.StorageDiagramName,
                "Active": diagramData.Active,
                "Articles": { connect: {ArticleID:  diagramData.ArticleID}}
            }
        })
        return diagramCreate.ArticleID;
    }

    /**
     * @param {Prisma.DiagramDeleteArgs["where"]["StorageDiagramName"]} storageDiagramUUID
     */
    async deleteDiagramByStorageUUID(storageDiagramUUID) {
        await this.db.diagram.delete({
            "where": {
                "StorageDiagramName": storageDiagramUUID
            }
        })
    }

    /**
     * @param {Prisma.DiagramDeleteArgs["where"]["StorageDiagramName"]} storageDiagramUUID
     */
    async countDiagramByStorageUUID(storageDiagramUUID) {
        return await this.db.diagram.count({
            "where": {
                "StorageDiagramName": storageDiagramUUID
            }
        })
    }
}

export default DiagramDb;
