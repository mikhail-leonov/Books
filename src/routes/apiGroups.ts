import { Router } from 'express';
import APIGroupController from '../controllers/apiGroupController';

const router = Router();

router.get ('/', 		APIGroupController.getGroups);
router.get ('/:id', 		APIGroupController.getGroup);
router.post('/create', 		APIGroupController.postGroup);
router.put ('/:id/edit', 	APIGroupController.putGroup);
router.get ('/:id/delete', 	APIGroupController.removeGroup);
router.post('/merge', 		APIGroupController.mergeGroup);

export default router;