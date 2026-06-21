import { Router } from 'express';
import APIMergeController from '../controllers/apiMergeController';

const router = Router();

router.get ('/:type/search', 	APIMergeController.search);
router.post('/:type', 		APIMergeController.merge);

export default router;
