import Transaction from '../../models/Transaction.model.js';
import { ApiError } from '../../utils/ApiError.js';
import * as aiService from '../ai/ai.service.js';
import * as notificationService from '../notification/notification.service.js';

export const createTransaction = async (userId, data) => {
  // 1. AI Auto-tagging (if category not provided or "Other")
  let aiCategory = null;
  if (!data.category || data.category === 'Other') {
    aiCategory = await aiService.categoriseExpense(data.description, data.merchant);
  }

  const transaction = await Transaction.create({
    ...data,
    category: data.category || aiCategory || 'Other',
    aiCategory,
    user: userId,
  });

  // 2. Anomaly Detection (Async - don't block response)
  if (transaction.type === 'expense') {
    checkAnomaly(transaction, userId).catch(err => console.error('Anomaly Detection Error:', err));
  }

  return transaction;
};

const checkAnomaly = async (transaction, userId) => {
  // Fetch last 30 transactions in same category for comparison
  const history = await Transaction.find({
    user: userId,
    category: transaction.category,
    type: 'expense',
    deleted: false,
    _id: { $ne: transaction._id }
  })
    .limit(30)
    .select('amount');

  if (history.length < 5) return; // Not enough data for statistical significance

  const amounts = history.map((t) => t.amount);
  const mean = amounts.reduce((s, v) => s + v, 0) / amounts.length;
  const std = Math.sqrt(
    amounts.reduce((s, v) => s + (v - mean) ** 2, 0) / amounts.length
  );

  // Flag if amount > mean + 2*std
  if (transaction.amount > mean + 2 * std) {
    const explanation = await aiService.explainAnomaly(transaction, mean);
    
    await Transaction.findByIdAndUpdate(transaction._id, { isAnomalous: true });
    
    await notificationService.createNotification(
      userId,
      'anomaly',
      'Anomaly Detected',
      explanation,
      { transactionId: transaction._id, amount: transaction.amount, category: transaction.category }
    );
  }
};

export const getTransactions = async (userId, query) => {
  const {
    type,
    category,
    startDate,
    endDate,
    search,
    minAmount,
    maxAmount,
    page = 1,
    limit = 20,
  } = query;

  const filters = {
    user: userId,
    deleted: false,
  };

  if (type) filters.type = type;
  if (category) filters.category = category;
  if (startDate || endDate) {
    filters.date = {};
    if (startDate) filters.date.$gte = new Date(startDate);
    if (endDate) filters.date.$lte = new Date(endDate);
  }
  if (minAmount || maxAmount) {
    filters.amount = {};
    if (minAmount) filters.amount.$gte = Number(minAmount);
    if (maxAmount) filters.amount.$lte = Number(maxAmount);
  }
  if (search) {
    filters.$or = [
      { merchant: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const transactions = await Transaction.find(filters)
    .sort({ date: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Transaction.countDocuments(filters);

  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTransactionById = async (userId, id) => {
  const transaction = await Transaction.findOne({ _id: id, user: userId, deleted: false });
  if (!transaction) throw new ApiError(404, 'Transaction not found');
  return transaction;
};

export const updateTransaction = async (userId, id, data) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, user: userId, deleted: false },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!transaction) throw new ApiError(404, 'Transaction not found');
  return transaction;
};

export const deleteTransaction = async (userId, id) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, user: userId, deleted: false },
    { $set: { deleted: true, deletedAt: new Date() } },
    { new: true }
  );
  if (!transaction) throw new ApiError(404, 'Transaction not found');
  return transaction;
};

export const bulkDeleteTransactions = async (userId, ids) => {
  const result = await Transaction.updateMany(
    { _id: { $in: ids }, user: userId, deleted: false },
    { $set: { deleted: true, deletedAt: new Date() } }
  );
  return result;
};

export const getMonthlySummary = async (userId) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const summary = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        deleted: false,
        date: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  return summary;
};

export const getCategorySummary = async (userId) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const summary = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        deleted: false,
        type: 'expense',
        date: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return summary;
};
