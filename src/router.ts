import { Router } from 'express';

import { articleIdValidator } from './middleware/validator/article.js';
import { handleExpressValidation } from './middleware/validator/expressValidatorHandler.js';
import * as diagramController from './controller/diagramController.js';
import * as textController from './controller/textController.js';
import userIdExtractor from './middleware/userExtractor.js';
import CheckUserArticleAccess from './middleware/userArticleAccess.js';

const router = Router();
const VISUAL_API_ENDPOINT = 'visual';

router.use(articleIdValidator, 
            userIdExtractor, 
            handleExpressValidation, 
            (new CheckUserArticleAccess()).checkAccessMiddleware)

router.get(`/:accountId/${VISUAL_API_ENDPOINT}/:articleId/concept-map`,
            diagramController.getConceptMap);

router.put(`/:accountId/${VISUAL_API_ENDPOINT}/:articleId/concept-map`, 
            diagramController.updateConceptMap);

router.get(`/:accountId/${VISUAL_API_ENDPOINT}/:articleId/summary`,
            textController.getSummary);


export default router;
