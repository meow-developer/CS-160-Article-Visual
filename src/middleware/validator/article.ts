import { param, query } from "express-validator";
import ArticleDb from "../../repo/articleDb.js";
import ValidationRestError from "./ownValidatorError.js";



export const articleIdValidator = param('articleId')
                                .toInt()
                                .isInt({min: 1})

export const articleQueryValidator = query('limit')
                                    .isInt({min: 1})
                                    .optional();