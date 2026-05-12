import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One budget document per user (updated/upserted monthly)
    },
    month: {
      type: String, // "YYYY-MM"
      required: true,
      index: true,
    },
    globalCap: {
      type: Number,
      default: 0,
    },
    categories: {
      type: Map,
      of: Number,
      default: {},
    },
    aiAdviceCache: {
      type: String,
      default: null,
    },
    adviceCachedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user and month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
