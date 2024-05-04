import { NextFunction, Response, Request } from "express";
import ArticleSummaryGet from "../service/articleSummaryGet.js";
import CheckUserAccess from "../service/checkUserAccess.js";
import RestResponseMaker from './tools/responseMaker.js';

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;
    const userId = req.userId;
    try {
        const checkAccessService = new CheckUserAccess(parseInt(articleId), userId);
        const checkAccess = await checkAccessService.checkAccess();

        if (checkAccess) {
            const articleSummaryGet = new ArticleSummaryGet(parseInt(articleId));
            const summary = await articleSummaryGet.get();

            res.status(200).send(summary);
        } else {
            const response = RestResponseMaker.makeErrorResponse(["Article not found"]);
            res.status(404).send(response);
        }   
    } catch (error) {
        next(error);
    }
}