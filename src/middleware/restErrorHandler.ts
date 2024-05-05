import { NextFunction, Request, Response } from "express";
import { RestError } from "../type/restError.js";


export const loggingError = (err: any) => {
    console.error(err);
}

export const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => { 
    loggingError(err);
    if (res.headersSent) {
        return next(err)
    }
    if (err instanceof RestError){
        res.status(err.statusCode).send(err.publicMessage);
        return;
    } else {
        res.status(500).send('Internal Server Error');
        return;
    }

}