import { Router } from 'express';
import UIBookController  from '../controllers/uiBookController';
import UIOtherController from '../controllers/uiOtherController';

const router = Router();

router.get('/import', 	UIOtherController.showImport);
router.get('/stat', 	UIOtherController.showStat);
router.get('/', 	UIBookController.showHome);
router.get('/favorite', UIBookController.showLikedBooks);
router.get('/recent', 	UIBookController.showRecentBooks);


export default router;