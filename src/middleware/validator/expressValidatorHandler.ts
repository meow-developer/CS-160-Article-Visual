import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RestResponse } from '../../type/restResponse.js';
import RestResponseMaker from '../../controller/tools/responseMaker.js';

export const handleExpressValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    const response = RestResponseMaker.makeErrorResponse(errors.array());

    return res.status(400).json(response);
  }

  next();
}