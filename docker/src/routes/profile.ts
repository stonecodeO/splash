import express from 'express';
import profileController from '../controllers/Profile';
import { validateSchema, Schemas } from '../middleware/validateSchema';
import { verifyJWT } from '../middleware/verifyToken';
import { verifyRoles } from '../middleware/verifyRole';
import { roles_list } from '../config/roles';
import { uploadFileMid } from '../middleware/upload';
const router = express.Router();

router.get('/all', profileController.readAllprofiles);
router.patch('/edit_profile/:profileId', verifyJWT, profileController.updateProfile);
router.delete('/delete_profile/:profileId', verifyJWT, profileController.deleteprofile);
router.get('/profile/:profileId', verifyJWT, profileController.readprofile);
router.post('/upload', uploadFileMid, profileController.uploadFiles);

export default router;
