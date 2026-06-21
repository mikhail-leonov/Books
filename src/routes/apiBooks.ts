import { Router } from 'express';
import APIBookController from '../controllers/apiBookController';
import APIGroupController from '../controllers/apiGroupController';

const router = Router();

router.get   ('/search',		APIBookController.searchBooks);
router.get   ('/', 			APIBookController.getBooks);
router.get   ('/:id', 			APIBookController.getBook);
router.post  ('/', 			APIBookController.postBook);
router.put   ('/:id', 			APIBookController.putBook);
router.delete('/:id', 			APIBookController.removeBook);
router.post  ('/:id/ai',                APIBookController.generateAIDescription);
router.post  ('/:id/like', 		APIBookController.likeBook);
router.post  ('/:id/unlike', 		APIBookController.unlikeBook);

router.get   ('/:id/group/:gid/1', 	APIGroupController.linkGroup);
router.get   ('/:id/group/:gid/0', 	APIGroupController.unlinkGroup);
router.get   ('/:id/group/:gid', 	APIGroupController.enumerateGroups);

export default router;