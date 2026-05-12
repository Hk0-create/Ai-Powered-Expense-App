import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import * as budgetController from './budget.controller.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(budgetController.getMyBudget)
  .put(budgetController.updateMyBudget);

router.get('/vs-actual', budgetController.getVsActual);
router.get('/advisor', budgetController.getAdvisor);

export default router;
