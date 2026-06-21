import { Router } from 'express';
import UIMergeController from '../controllers/uiMergeController';

const router = Router();

router.get('/', 	UIMergeController.showMerge);

export default router;
