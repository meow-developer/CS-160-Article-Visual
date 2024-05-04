import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export default async function userIdExtractor(req: Request, res: Response, next: NextFunction){
    const urlSplit = req.url.split('/');
    const userId = urlSplit[1];

    req.userId = userId;
    next();
}