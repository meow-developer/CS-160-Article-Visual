import { NextFunction, Response, Request } from "express";
import ConceptMapGetService from "../service/conceptMapGet.js";
import CheckUserAccess from "../service/checkUserAccess.js";
import RestResponseMaker from './tools/responseMaker.js';

export const getConceptMap = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;
    const userId = req.userId;
    try {
        const checkAccessService = new CheckUserAccess(parseInt(articleId), userId);
        const checkAccess = await checkAccessService.checkAccess();

        if (checkAccess) {
            const conceptMapGetService = new ConceptMapGetService(parseInt(articleId), req);
            const conceptMapFilePath = await conceptMapGetService.get();

            res.status(200).sendFile(conceptMapFilePath);
        } else {
            const response = RestResponseMaker.makeErrorResponse(["Article not found"]);
            res.status(404).send(response);
        }

    } catch (error) {
        next(error);
    }
}

export const updateConceptMap = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).send("");
    } catch (error) {
        next(error);
    }
}