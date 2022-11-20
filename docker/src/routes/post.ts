import express from 'express';
import postController from '../controllers/Post';
import { verifyJWT } from '../middleware/verifyToken';

const router = express.Router();

router.post('/new_post', verifyJWT, postController.createpost);
router.get('/all/', postController.readAllposts);
router.patch('/edit_post/:postId', postController.updatepost);
router.delete('/delete_post/:userId', postController.deletepost);
router.get('/post/:postId', postController.readpost);

export default router;
