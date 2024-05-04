import SummaryGenerationService from "../../../src/service/ChatGpt/summaryGeneration";

describe("SummaryGenerationService", () => {
    let summaryGenerationService: SummaryGenerationService;

    beforeEach(() => {
        summaryGenerationService = new SummaryGenerationService();
    });

    it("should generate a summary from PDF text", async () => {
        const pdfText = "CRISPR technology is a simple yet powerful tool for editing genomes. It allows researchers to easily alter DNA sequences and modify gene function. Its many potential applications include correcting genetic defects, treating and preventing the spread of diseases, and improving crops. However, its use in humans raises ethical concerns, as it could be used to create designer babies. Despite these concerns, CRISPR technology has the potential to revolutionize medicine and agriculture.";
        const summary = await summaryGenerationService.generate(pdfText);
        
        console.log(summary )
    });
});
