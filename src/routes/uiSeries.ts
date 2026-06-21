import { Router } from 'express';
import UISerieController from '../controllers/uiSerieController';

const router = Router();

router.get('/search', 	UISerieController.searchSeries);
router.get('/', 	UISerieController.showSeries);
router.get('/:id', 	UISerieController.showSeriesBooks);

export default router;