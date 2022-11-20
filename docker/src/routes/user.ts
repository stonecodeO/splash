import express from 'express';
import userController from '../controllers/User';
import { validateSchema, Schemas } from '../middleware/validateSchema';
import { verifyJWT } from '../middleware/verifyToken';
import { verifyRoles } from '../middleware/verifyRole';
import { roles_list } from '../config/roles';
import { uploadFileMid } from '../middleware/upload';
const router = express.Router();

router.get('/all/', verifyJWT, verifyRoles(roles_list.admin), userController.readAllUsers);
router.patch('/edit_user/:userId', validateSchema(Schemas.user.update), userController.updateUser);
router.delete('/delete_user/:userId', userController.deleteUser);
router.get('/user/:userId', userController.readUser);

export default router;
