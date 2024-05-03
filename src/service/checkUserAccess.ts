import UserArticleDb from '../repo/userArticleDb.js';

export default class CheckUserAccess {
    private userArticleDb: UserArticleDb = UserArticleDb.getInstance();
    private articleId: number;
    private userId: string;

    constructor(articleId: number, userId: string) {
        this.articleId = articleId;
        this.userId = userId;
    }

    public async checkAccess(): Promise<boolean> {
        const result = await this.userArticleDb.countUserArticlesId(this.articleId, this.userId);
        if (result > 0) {
            return true;
        } else {
            return false;
        }
    }
    
}