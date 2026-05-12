import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

export default router;
