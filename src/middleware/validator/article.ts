import { param, query } from "express-validator";

export const articleIdValidator = param('articleId')
                                .isInt({min: 1})
                                .withMessage('Article ID must be a positive integer');

export const articleQueryValidator = query('limit')
                                    .isInt({min: 1})
                                    .optional();