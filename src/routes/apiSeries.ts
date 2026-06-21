import { Router } from 'express';
import APISerieController from '../controllers/apiSerieController';

const router = Router();

router.get('/', 		APISerieController.getSeries);
router.get('/:id', 		APISerieController.getSerie);
router.post('/create', 		APISerieController.postSerie);
router.put('/:id/edit', 	APISerieController.putSerie);
router.get('/:id/delete', 	APISerieController.removeSerie);
router.post('/merge', 		APISerieController.mergeSerie);

export default router;