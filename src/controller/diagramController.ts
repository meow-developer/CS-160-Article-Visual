import { NextFunction, Response, Request } from "express";
import ConceptMapGetService from "../service/conceptMapGet.js";
import ConceptMapUpdateService from "../service/conceptMapUpdate.js";
import RestResponseMaker from './tools/responseMaker.js';

export const getConceptMap = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = parseInt(req.params.articleId);
    const userId = req.userId;
    try {
        const conceptMapGetService = new ConceptMapGetService(articleId, req);
        const conceptMapFilePath = await conceptMapGetService.get();

        res.status(200).sendFile(conceptMapFilePath);

    } catch (error) {
        next(error);
    }
}

export const updateConceptMap = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = parseInt(req.params.articleId);
    const userId = req.userId;

    try {
        const conceptMapUpdateService = new ConceptMapUpdateService(articleId, req);
        const conceptMapFilePath = await conceptMapUpdateService.update();

        res.status(200).sendFile(conceptMapFilePath);
    } catch (error) {
        next(error);
    }
}