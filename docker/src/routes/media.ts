import express from 'express';
import mediaController from '../controllers/Media';

const router = express.Router();

 
router.post('/new_media', mediaController.createMedia);
router.get('/all/', mediaController.readAllMedias);
router.patch('/edit_media/:mediaId', mediaController.updateMedia);
router.delete('/delete_media/:mediaId', mediaController.deleteMedia);
router.get('/media/:mediaId', mediaController.readMedia);


export default router;