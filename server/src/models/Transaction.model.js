import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Food & Dining',
        'Transport',
        'Shopping',
        'Entertainment',
        'Health & Fitness',
        'Utilities',
        'Housing',
        'Education',
        'Travel',
        'Personal Care',
        'Investments',
        'Other',
      ],
      default: 'Other',
    },
    merchant: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFreq: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', null],
      default: null,
    },
    recurringNext: {
      type: Date,
      default: null,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    isAnomalous: {
      type: Boolean,
      default: false,
    },
    aiCategory: {
      type: String,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user-scoped queries and soft-delete filtering
transactionSchema.index({ user: 1, deleted: 1, date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
