import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { getLatestInsight, parseNL } from './ai.controller.js';

const router = Router();
router.use(protect);

router.get('/insight/latest', getLatestInsight);
router.post('/insight/refresh', getLatestInsight); // Same logic, forced refresh
router.post('/parse-nl', parseNL);

export default router;
