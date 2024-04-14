import ArticleStorage from "../repo/articleStorage.js";
import ArticleDb from "../repo/articleDb.js";
import ArticleGetService from "./articleGet.js";
import ConceptMapGenerationService from "./conceptMapGeneration.js";
import { readPdfText } from 'pdf-text-reader';


export default class ConceptMapGetService{
    private async checkIfConceptMapExistsInDb(articleId: string): Promise<boolean> {
        return true;
    }
    /**
     * @returns {Promise<string>} - The pdf file path.
     */
    private async getPdfFromStorage(articleId: number): Promise<string> {
        const articleStorage = new ArticleGetService(articleId);
        return await articleStorage.get();
    }

    private async getTextFromPdf(pdfFilePath: string): Promise<string> {
        try {
            return await readPdfText({filePath: pdfFilePath});
        } catch (err) {
            throw new Error("Error reading pdf text");
        }
    }

    /**
     * @return {Promise<string>} - The concept map in mermaid format.
     */
    private async getConceptMapFromStorage(articleStorageUUID: string): Promise<string> {
        return "";
    }

    /**
     * @return {Promise<string>} - The concept map in mermaid format.
     */
    private async generateConceptMap(pdfText: string): Promise<string> {
        const conceptMapGenerationService = new ConceptMapGenerationService();
        return await conceptMapGenerationService.generate(pdfText);
    }
}