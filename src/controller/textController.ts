import { NextFunction, Response, Request } from "express";
import ArticleSummaryGet from "../service/articleSummaryGet.js";
import RestResponseMaker from './tools/responseMaker.js';

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;
    const userId = req.userId;
    try {
        const articleSummaryGet = new ArticleSummaryGet(parseInt(articleId));
        const summary = await articleSummaryGet.get();

        res.status(200).send(summary); 
        

    } catch (error) {
        next(error);
    }
}

export const updateSummary = getSummary;