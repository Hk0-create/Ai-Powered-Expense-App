import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as budgetService from './budget.service.js';

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

export const getMyBudget = asyncHandler(async (req, res) => {
  const month = req.query.month || getCurrentMonth();
  const budget = await budgetService.getBudget(req.user._id, month);
  return res.status(200).json(new ApiResponse(200, budget, 'Budget fetched successfully'));
});

export const updateMyBudget = asyncHandler(async (req, res) => {
  const data = { ...req.body, month: req.body.month || getCurrentMonth() };
  const budget = await budgetService.updateBudget(req.user._id, data);
  return res.status(200).json(new ApiResponse(200, budget, 'Budget updated successfully'));
});

export const getVsActual = asyncHandler(async (req, res) => {
  const month = req.query.month || getCurrentMonth();
  const report = await budgetService.getBudgetVsActual(req.user._id, month);
  return res.status(200).json(new ApiResponse(200, report, 'Budget vs Actual report fetched successfully'));
});

export const getAdvisor = asyncHandler(async (req, res) => {
  const month = getCurrentMonth();
  const advice = await budgetService.getAIAdvisor(req.user._id, month);
  return res.status(200).json(new ApiResponse(200, advice, 'AI Budget advice fetched successfully'));
});
