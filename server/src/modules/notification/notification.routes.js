import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import * as notificationController from './notification.controller.js';

const router = Router();

router.use(protect); // Secure all notification endpoints

router.get('/', notificationController.getAll);
router.patch('/:id/read', notificationController.read);
router.post('/read-all', notificationController.readAll);

export default router;
