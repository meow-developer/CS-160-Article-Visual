import ArticleTextGet from "./articleTextGet.js";
import SummaryGenerationService from "./ChatGpt/summaryGeneration.js";

export default class ArticleSummaryGet{
    private articleId: number;

    constructor(articleId: number){
        this.articleId = articleId;
    }

    private async getArticleTextFromStorage(){
        const articleTextGet = new ArticleTextGet(this.articleId);
        return await articleTextGet.get();
    }

    private async generateSummary(articleText: string): Promise<string> {
        const summaryGenerationService = new SummaryGenerationService();
        return await summaryGenerationService.generate(articleText);
    }

    public async get() {
        const articleText = await this.getArticleTextFromStorage();
        const summary = await this.generateSummary(articleText);

        return summary;
    }
}