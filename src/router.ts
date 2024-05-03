import { Router } from 'express';

import { articleIdValidator } from './middleware/validator/article.js';
import { handleExpressValidation } from './middleware/validator/expressValidatorHandler.js';
import * as diagramController from './controller/diagramController.js';
import * as textController from './controller/textController.js';
import userIdExtractor from './middleware/userExtractor.js';

const router = Router();

router.use(userIdExtractor);

router.use(articleIdValidator)
router.use(handleExpressValidation)

router.get('/:userId/:articleId/concept-map',
            diagramController.getConceptMap);

router.put('/:userId/:articleId/concept-map', 
            diagramController.updateConceptMap);

router.get('/:userId/:articleId/summary',
            textController.getSummary);


export default router;