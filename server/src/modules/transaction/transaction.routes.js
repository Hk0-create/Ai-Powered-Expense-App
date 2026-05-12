import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import * as transactionController from './transaction.controller.js';

const router = Router();

router.use(protect); // All transaction routes are protected

router.route('/')
  .post(transactionController.create)
  .get(transactionController.getAll)
  .delete(transactionController.bulkRemove);

router.get('/summary/monthly', transactionController.getMonthlySummary);
router.get('/summary/category', transactionController.getCategorySummary);

router.route('/:id')
  .get(transactionController.getById)
  .put(transactionController.update)
  .delete(transactionController.remove);

export default router;
