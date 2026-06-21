import { Router } from 'express';
import UIAuthorController from '../controllers/uiAuthorController';

const router = Router();

router.get('/search', 	UIAuthorController.searchAuthors);
router.get('/', 	UIAuthorController.showAuthors);
router.get('/:id', 	UIAuthorController.showAuthorBooks);

export default router;