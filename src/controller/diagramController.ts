import { NextFunction, Response, Request } from "express";

export const getConceptMap = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).sendFile("");
    } catch (error) {
        next(error);
    }
}