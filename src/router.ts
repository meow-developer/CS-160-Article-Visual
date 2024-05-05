import { Router } from 'express';

import { articleIdValidator } from './middleware/validator/article.js';
import { handleExpressValidation } from './middleware/validator/expressValidatorHandler.js';
import * as diagramController from './controller/diagramController.js';
import * as textController from './controller/textController.js';
import userIdExtractor from './middleware/userExtractor.js';
import CheckUserArticleAccess from './middleware/userArticleAccess.js';

const router = Router();


const VISUAL_API_ENDPOINT = 'visual';


router.get(`/:accountId/${VISUAL_API_ENDPOINT}/:articleId/concept-map`,
            articleIdValidator, 
            userIdExtractor, 
            handleExpressValidation, 
            (new CheckUserArticleAccess()).checkAccessMiddleware,
            diagramController.getConceptMap);

router.put(`/:accountId/${VISUAL_API_ENDPOINT}/:articleId/concept-map`, 
            articleIdValidator, 
            userIdExtractor, 
            handleExpressValidation, 
            (new CheckUserArticleAccess()).checkAccessMiddleware,
            diagramController.updateConceptMap);

router.get(`/:accountId/${VISUAL_API_ENDPOINT}/:articleId/summary`,
            articleIdValidator, 
            userIdExtractor, 
            handleExpressValidation, 
            (new CheckUserArticleAccess()).checkAccessMiddleware,
            textController.getSummary);


export default router;
