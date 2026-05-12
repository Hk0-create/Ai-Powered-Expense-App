import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as transactionService from './transaction.service.js';

export const create = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, transaction, 'Transaction created successfully'));
});

export const getAll = asyncHandler(async (req, res) => {
  const { transactions, pagination } = await transactionService.getTransactions(req.user._id, req.query);
  return res.status(200).json(new ApiResponse(200, { transactions, pagination }, 'Transactions fetched successfully'));
});

export const getById = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.user._id, req.params.id);
  return res.status(200).json(new ApiResponse(200, transaction, 'Transaction fetched successfully'));
});

export const update = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(req.user._id, req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, transaction, 'Transaction updated successfully'));
});

export const remove = asyncHandler(async (req, res) => {
  await transactionService.deleteTransaction(req.user._id, req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Transaction deleted successfully'));
});

export const bulkRemove = asyncHandler(async (req, res) => {
  await transactionService.bulkDeleteTransactions(req.user._id, req.body.ids);
  return res.status(200).json(new ApiResponse(200, {}, 'Transactions deleted successfully'));
});

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const summary = await transactionService.getMonthlySummary(req.user._id);
  return res.status(200).json(new ApiResponse(200, summary, 'Monthly summary fetched successfully'));
});

export const getCategorySummary = asyncHandler(async (req, res) => {
  const summary = await transactionService.getCategorySummary(req.user._id);
  return res.status(200).json(new ApiResponse(200, summary, 'Category summary fetched successfully'));
});
