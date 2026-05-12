import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as aiService from './ai.service.js';
import Transaction from '../../models/Transaction.model.js';

export const getLatestInsight = asyncHandler(async (req, res) => {
  // Get last 7 days vs prior 7 days data
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const [thisWeek, lastWeek] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense', deleted: false, date: { $gte: weekAgo } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]),
    Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense', deleted: false, date: { $gte: twoWeeksAgo, $lt: weekAgo } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ])
  ]);

  if (thisWeek.length === 0) {
    return res.status(200).json(new ApiResponse(200, null, 'Not enough data'));
  }

  const insight = await aiService.generateWeeklyInsight(thisWeek, lastWeek, req.user);
  return res.status(200).json(new ApiResponse(200, insight, 'Insight generated'));
});

export const parseNL = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) throw new ApiError(400, 'Text is required');

  const parsed = await aiService.parseNLExpense(text);
  return res.status(200).json(new ApiResponse(200, parsed, 'Parsed successfully'));
});
