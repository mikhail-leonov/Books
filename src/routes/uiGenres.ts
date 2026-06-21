import { Router } from 'express';
import UIGenreController from '../controllers/uiGenreController';

const router = Router();

router.get('/search', 	UIGenreController.searchGenres);
router.get('/', 	UIGenreController.showGenres);
router.get('/:id', 	UIGenreController.showGenreBooks);

export default router;