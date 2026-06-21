import { Router } from 'express';
import UIBookController from '../controllers/uiBookController';

const router = Router();

router.get('/read/:id', UIBookController.showReadBook);
router.get('/search', 	UIBookController.searchBooks);

export default router;