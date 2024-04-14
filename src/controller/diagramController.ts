import { NextFunction, Response, Request } from "express";
import ConceptMapGetService from "../service/conceptMapGet.js";


export const getConceptMap = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conceptMapGetService = new ConceptMapGetService();

        res.status(200).sendFile("");
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