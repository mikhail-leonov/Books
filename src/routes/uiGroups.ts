import { Router } from 'express';
import UIGroupController from '../controllers/uiGroupController';

const router = Router();

router.get('/search', UIGroupController.searchGroups);
router.get('/',       UIGroupController.showGroups);
router.get('/:id',    UIGroupController.showGroupBooks);

export default router;