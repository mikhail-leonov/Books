import { Router } from 'express';
import APIAuthorController from '../controllers/apiAuthorController';

const router = Router();

router.get('/', 		APIAuthorController.getAuthors);
router.get('/:id', 		APIAuthorController.getAuthor);
router.post('/create', 		APIAuthorController.postAuthor);
router.put('/:id/edit', 	APIAuthorController.putAuthor);
router.get('/:id/delete', 	APIAuthorController.removeAuthor);
router.post('/merge', 		APIAuthorController.mergeAuthors);

export default router;