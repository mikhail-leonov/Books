import { Router } from 'express';
import APIGenreController from '../controllers/apiGenreController';

const router = Router();

router.get('/', 		APIGenreController.getGenres);
router.get('/:id', 		APIGenreController.getGenre);
router.post('/create', 		APIGenreController.postGenre);
router.put('/:id/edit', 	APIGenreController.putGenre);
router.get('/:id/delete', 	APIGenreController.removeGenre);
router.post('/merge', 		APIGenreController.mergeGenres);

export default router;