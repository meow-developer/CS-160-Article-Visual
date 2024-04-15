import DiagramStorage from '../repo/diagramStorage.js';
import DiagramDb from '../repo/diagramDb.js';
import crypto from 'crypto';
import formidable from 'formidable';

class DiagramCreate {
    storage = DiagramStorage.getInstance();
    db = DiagramDb.getInstance();

    constructor() {}

    generateUUIDForDiagramStore() {
        return crypto.randomUUID();
    }

    /**
     * @param {import('crypto').UUID} uuid
     */
    async checkUUIDDbCollision(uuid) {
        const articleCount = await this.db.countDiagramByStorageUUID(uuid);
        const isUUIDCollided = articleCount > 0;
        
        return isUUIDCollided;
    }

    async safeUUIDGeneration() {
        const MAX_TRIES = 2; //It's impossible to have a collision with 2 tries
        let tries = 0;
       
        do {
            const uuid = this.generateUUIDForDiagramStore();
            const isUUIDCollision = await this.checkUUIDDbCollision(uuid);

            if (!isUUIDCollision) {
                return uuid;
            }
            tries++;
        } while (tries < MAX_TRIES);

        throw new Error("Failed to generate UUID");
    }

    /**
     * @param {string | import('crypto').UUID} diagramStorageUUID
     * @param {number} articleId
     */
    async writeDiagramToDb(diagramStorageUUID, articleId){
        const diagram = {
            ArticleID: articleId,
            StorageDiagramName: diagramStorageUUID,
            Active: true
        }
        return await this.db.insertDiagram(diagram);
    }

    /**
     * @param {string | import('crypto').UUID} diagramStorageUUID
     * @param {string} diagramFilePath
     */
    async saveDiagramToStorage(diagramStorageUUID, diagramFilePath){
        await this.storage.saveDiagram(
            diagramStorageUUID + ".mmd",
            diagramFilePath
        )
    }

    /**
     * @param {string | import('crypto').UUID} diagramStorageUUID
     */
    async deleteDiagramFromDb(diagramStorageUUID){
        await this.db.deleteDiagramByStorageUUID(diagramStorageUUID);
    }

    /**
     * @param {string | import('crypto').UUID} diagramStorageUUID
     */
    async deleteDiagramFromStorage(diagramStorageUUID){
        await this.storage.deleteDiagram(diagramStorageUUID);
    }

    /**
     * @param {string} file
     * @param {number} articleId
     * @returns {Promise<number>} - The ID of the article
     */
    async save(file, articleId) {
        const diagramStorageUUID = await this.safeUUIDGeneration();
        try {
            const id = await this.writeDiagramToDb(diagramStorageUUID, articleId);
            await this.saveDiagramToStorage(diagramStorageUUID, file);
            return id;
        } catch (err) {
            //Ensure atomicity
            //Undo all the changes made to the db and storage
            await this.deleteDiagramFromDb(diagramStorageUUID);
            await this.deleteDiagramFromStorage(diagramStorageUUID);

            throw err;
        }
    }
}

export default DiagramCreate;