import { Request } from "express";
import { RestError } from "../../restError.js";
import { OwnValidationResult } from "./ownValidator.js";

export default class ValidationRestError extends RestError{
    public statusCode: number;
    public publicMessage: string;

    constructor(internalMessage: string | null, 
                statusCode: number = 400, 
                publicMessage: string = "Bad Request"){
        super(internalMessage || "Validation Error");
        this.statusCode = statusCode;
        this.publicMessage = publicMessage;
    }
}

