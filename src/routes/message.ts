import express from 'express';
import messageController from '../controllers/Message';
import { verifyJWT } from '../middleware/verifyToken';

const router = express.Router();

router.post('/new_message',messageController.createMessage);
router.get('/all/', messageController.readAllMessages);
router.delete('/delete_message/:userId', messageController.deleteMessage);
router.get('/message/:messageId', messageController.readMessage);

export default router;
