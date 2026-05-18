import Budget from '../../models/Budget.model.js';
import Transaction from '../../models/Transaction.model.js';
import { ApiError } from '../../utils/ApiError.js';
import * as aiService from '../ai/ai.service.js';

export const getBudget = async (userId, month) => {
  let budget = await Budget.findOne({ user: userId, month });
  if (!budget) {
    budget = await Budget.create({ user: userId, month, categories: new Map() });
  }
  return budget;
};

export const updateBudget = async (userId, data) => {
  const { month, globalCap, categories } = data;
  const budget = await Budget.findOneAndUpdate(
    { user: userId, month },
    { $set: { globalCap, categories } },
    { new: true, upsert: true }
  );
  return budget;
};

export const getBudgetVsActual = async (userId, month) => {
  const budget = await getBudget(userId, month);
  
  const startOfMonth = new Date(`${month}-01`);
  const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

  const actuals = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: 'expense',
        deleted: false,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
      }
    }
  ]);

  const actualMap = actuals.reduce((acc, curr) => {
    acc[curr._id] = curr.total;
    return acc;
  }, {});

  const categories = [
    'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
    'Health & Fitness', 'Utilities', 'Housing', 'Education',
    'Travel', 'Personal Care', 'Investments', 'Other'
  ];

  const report = categories.map(cat => {
    const cap = budget.categories.get(cat) || 0;
    const spent = actualMap[cat] || 0;
    return {
      category: cat,
      cap,
      spent,
      remaining: Math.max(0, cap - spent),
      percent: cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0
    };
  });

  return {
    globalCap: budget.globalCap,
    totalSpent: Object.values(actualMap).reduce((a, b) => a + b, 0),
    categories: report
  };
};

export const getAIAdvisor = async (userId, month) => {
  const budget = await Budget.findOne({ user: userId, month });
  if (budget && budget.aiAdviceCache && !budget.aiAdviceCache.includes('Your spending is being tracked') && (new Date() - budget.adviceCachedAt < 30 * 60 * 1000)) {
    return budget.aiAdviceCache;
  }

  const status = await getBudgetVsActual(userId, month);
  // In a real app, we'd pass detailed data to Gemini
  // For now, a simplified version
  const advice = await aiService.getForecastCommentary(status.totalSpent, status.globalCap || 50000, "PKR");
  
  if (budget) {
    budget.aiAdviceCache = advice;
    budget.adviceCachedAt = new Date();
    await budget.save();
  }

  return advice;
};
