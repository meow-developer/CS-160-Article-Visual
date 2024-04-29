import { Router } from 'express';

import { articleIdValidator } from './middleware/validator/article.js';
import { handleExpressValidation } from './middleware/validator/expressValidatorHandler.js';
import * as diagramController from './controller/diagramController.js';
import * as textController from './controller/textController.js';

const router = Router();

router.use(articleIdValidator)
router.use(handleExpressValidation)


router.get('/:articleId/concept-map',
            diagramController.getConceptMap);

router.put('/:articleId/concept-map', 
            diagramController.updateConceptMap);

router.get('/:articleId/summary',
            textController.getSummary);


export default router;