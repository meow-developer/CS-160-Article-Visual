import ConceptMapGenerationService from "../../src/service/conceptMapGeneration.js";

describe("ConceptMapGenerationService", () => {
    let conceptMapGenerationService: ConceptMapGenerationService;

    beforeEach(() => {
        conceptMapGenerationService = new ConceptMapGenerationService();
    });

    describe("generate", () => {
        it("should generate a concept map from PDF text", async () => {
            const EXAMPLE_PDF_TEXT = "CRISPR technology is a simple yet powerful tool for editing genomes. It allows researchers to easily alter DNA sequences and modify gene function. Its many potential applications include correcting genetic defects, treating and preventing the spread of diseases, and improving crops. However, its use in humans raises ethical concerns, as it could be used to create designer babies. Despite these concerns, CRISPR technology has the potential to revolutionize medicine and agriculture.";
            const conceptMap = await conceptMapGenerationService.generate(EXAMPLE_PDF_TEXT);

            console.log(conceptMap)
        }, 30000);
    });

});
