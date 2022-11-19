import express from 'express';
import authController from '../controllers/Auth';
import { validateSchema, Schemas } from '../middleware/validateSchema';

const router = express.Router();

 
router.post('/register', validateSchema(Schemas.user.create), authController.handleRegisterUser);
router.post('/login', authController.handleLogin);
router.get('/logout', authController.handleLogout);
router.get('/refresh_token', authController.handleRefreshToken);


export default router;