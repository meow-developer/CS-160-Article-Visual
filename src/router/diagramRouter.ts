import { Router } from 'express';
import * as diagramController from '../controller/diagramController.js';
import { articleIdValidator, articleQueryValidator } from '../middleware/validator/article.js';
import { handleExpressValidation } from '../middleware/validator/expressValidatorHandler.js';


const router = Router();


router.get('/:articleId/concept-map', 
            articleIdValidator,
            handleExpressValidation,
            diagramController.getConceptMap);

router.put('/:articleId/concept-map', 
            articleIdValidator,
            handleExpressValidation,
            diagramController.updateConceptMap);


export default router;