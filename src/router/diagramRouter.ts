import { Router } from 'express';
import * as diagramController from '../controller/diagramController.js';
import { articleIdValidator, articleQueryValidator } from '../middleware/validator/article.js';



const router = Router();


router.get('/:articleId/concept-map', articleIdValidator, diagramController.getConceptMap);


export default router;