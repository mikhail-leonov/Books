import { Router } from 'express';
import APIOtherController from '../controllers/apiOtherController';

const router = Router();

router.post('/import/run', 		APIOtherController.runManualImport);
router.post('/email-book/:id/:mail', 	APIOtherController.emailBook);
router.post('/upload', 			APIOtherController.uploadFiles);

export default router;