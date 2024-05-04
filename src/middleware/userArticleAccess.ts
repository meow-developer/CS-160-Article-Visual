import UserArticleDb from '../repo/userArticleDb.js';
import { Request, Response, NextFunction } from 'express';
import RestResponseMaker from '../controller/tools/responseMaker.js';

export default class CheckUserArticleAccess {
    private userArticleDb: UserArticleDb = UserArticleDb.getInstance();

    constructor() {
        this.checkAccessMiddleware = this.checkAccessMiddleware.bind(this);
    }

    private async checkAccess(articleId: number, userId: string): Promise<boolean> {
        const result = await this.userArticleDb.countUserArticlesId(articleId, userId);
        if (result > 0) {
            return true;
        } else {
            return false;
        }
    }

    public async checkAccessMiddleware(req: Request, res: Response, next: NextFunction) {
        const articleId = parseInt(req.params.articleId);
        const userId = req.userId;

        try {
            const isAllow = await this.checkAccess(articleId, userId);
            if (!isAllow) {
                const response = RestResponseMaker.makeErrorResponse(["Article not found"]);
                res.status(404).send(response);
                return;
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}