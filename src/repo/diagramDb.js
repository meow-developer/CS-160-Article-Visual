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
    async getDiagramByArticleId(articleId) {
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
                "StorageDiagramUUID": diagramData.StorageDiagramName,
                "Active": diagramData.Active,
                "Articles": { connect: {ArticleID:  diagramData.ArticleID}}
            }
        })
        return diagramCreate.ArticleID;
    }

    /**
     * @param {Prisma.DiagramDeleteArgs["where"]["StorageDiagramUUID"]} storageDiagramUUID
     */
    async deleteDiagramByStorageUUID(storageDiagramUUID) {
        await this.db.diagram.delete({
            "where": {
                "StorageDiagramUUID": storageDiagramUUID
            }
        })
    }

    /**
     * @param {Prisma.DiagramDeleteArgs["where"]["StorageDiagramUUID"]} storageDiagramUUID
     */
    async countDiagramByStorageUUID(storageDiagramUUID) {
        return await this.db.diagram.count({
            "where": {
                "StorageDiagramUUID": storageDiagramUUID
            }
        })
    }

    /**
     * @param {Prisma.DiagramDeleteArgs["where"]["ArticleID"]} articleId 
     */
    async countDiagramByArticleId(articleId) {
        return await this.db.diagram.count({
            "where": {
                "ArticleID": articleId
            }
        })
    }
}

export default DiagramDb;
