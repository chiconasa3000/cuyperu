import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(authMiddleware);
router.get('/me', authController.getMe);
router.put('/profile', authController.updateProfile);
router.put('/password', authController.changePassword);

export default router;