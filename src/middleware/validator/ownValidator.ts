import { Request, Response, NextFunction } from "express";
import ValidationRestError from "./ownValidatorError.js";

interface BaseResult {
    isCheckPass: boolean;
    validationMessage: string | null;
}


interface PassResult extends BaseResult {
    isCheckPass: true;
    failPublicMsg?: undefined;
    failPublicStatusCode?: undefined;
}

interface FailResult extends BaseResult {
    isCheckPass: false;
    failPublicMsg: string;
    failPublicStatusCode?: number;
}


type TestResult = PassResult | FailResult;

type Test = { [testName: string]: TestResult };


declare global {
    namespace Express {
        interface Request {
            ownValidation: {
                testResult: Test,
                validatedData: {[key: string]: any},
                extra: {[key: string]: any}
            }
        }
    }
}

export class OwnValidationStepError extends Error {
    public testName: string;
    public testResult: FailResult;
    constructor(testName: string, testResult: FailResult){
        super();
        this.testName = testName;
        this.testResult = testResult;
    }
}


export class OwnValidationResult {
    public static getResult = (req: Request) => {
        return req.ownValidation.testResult;
    }
    public static getUniqueFailResult = (req: Request) => {
        let failResult: FailResult | null = null;
        const testResult = req.ownValidation.testResult;
        for (const testName in testResult) {
            const test = testResult[testName];
            if (!test.isCheckPass) {
                failResult = test;
                break;
            }
        }
        return failResult;
    }
    public static isFail = (req: Request) => {
        return OwnValidationResult.getUniqueFailResult(req) !== null;
    }
}

export abstract class OwnValidator {
    protected ownValidationResult: Test | undefined;

    constructor(){
        this._ = this._.bind(this);
    }

    protected initReqTest(req: Request){
        if (!req.ownValidation) {
            req.ownValidation = {
                testResult: {},
                validatedData: {},
                extra: new Map()
            }
        }
        this.ownValidationResult = req.ownValidation.testResult;
    }
    
    private addTestResult(testName: string, testResult: TestResult){
        this.ownValidationResult![testName] = testResult;
    }

    protected addPassResult(testName: string, validationMessage: string | null = null){
        this.addTestResult(testName, {
            isCheckPass: true,
            validationMessage
        });
    }    

    private addFailResult(testName: string, failPublicMsg: string = "Bad Request", failPublicStatusCode: number = 400, validationMessage: string | null = null){
        this.addTestResult(testName, {
            isCheckPass: false,
            failPublicMsg,
            failPublicStatusCode,
            validationMessage
        });
    }

    protected addFailStep(testName: string, failPublicMsg: string = "Bad Request", failPublicStatusCode: number = 400, validationMessage: string | null = null){
        this.addFailResult(testName, failPublicMsg, failPublicStatusCode, validationMessage);
        throw new OwnValidationStepError(testName, {
            isCheckPass: false,
            failPublicMsg,
            failPublicStatusCode,
            validationMessage
        });
    }

    private passValidationErrorResponse(next: NextFunction, testName: string, failResult: FailResult){
        next(new ValidationRestError(`Running test: ${testName}.\n Result: \n ${failResult}`, 
                                    failResult.failPublicStatusCode, failResult.failPublicMsg));
    }

    public async _(req: Request, res: Response, next: NextFunction){
        this.initReqTest(req);
        try {
            await this.validate(req, res, next);
            console.log("Validation passed")
        } catch (err) {
            if (err instanceof OwnValidationStepError){
                this.passValidationErrorResponse(next, err.testName, err.testResult);
            } else {
                next(err)
            }
        }
    }

    abstract validate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
