import { NextFunction, Response, Request } from "express";
import ConceptMapGetService from "../service/conceptMapGet.js";

export const getConceptMap = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;
    try {
        const conceptMapGetService = new ConceptMapGetService(parseInt(articleId), req);
        const conceptMapFilePath = await conceptMapGetService.get();

        res.status(200).sendFile(conceptMapFilePath);

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