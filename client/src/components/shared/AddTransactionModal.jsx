import React, { useState } from 'react';
import { X, Wand2, Loader2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health & Fitness', 'Utilities', 'Housing', 'Education',
  'Travel', 'Personal Care', 'Investments', 'Other'
];

const AddTransactionModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    merchant: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
  });
  const [nlText, setNlText] = useState('');
  const [isNLParsing, setIsNLParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNLParse = async () => {
    if (!nlText.trim()) return;
    setIsNLParsing(true);
    try {
      const { data } = await api.post('/ai/parse-nl', { text: nlText });
      const parsed = data.data;
      setForm(prev => ({
        ...prev,
        amount: parsed.amount || prev.amount,
        merchant: parsed.merchant || prev.merchant,
        description: parsed.description || prev.description,
        category: parsed.category || prev.category,
        date: parsed.date || prev.date,
      }));
      setNlText('');
      toast.success('AI parsed your expense!');
    } catch {
      toast.error('Could not parse. Fill manually.');
    } finally {
      setIsNLParsing(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Enter a valid amount');
    setIsSaving(true);
    try {
      await api.post('/transactions', { ...form, amount: Number(form.amount) });
      toast.success('Transaction saved!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* AI Natural Language Input */}
          <div className="bg-indigo-50 rounded-2xl p-4 border border-primary/20">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
              <Wand2 className="w-3 h-3" /> AI Quick Parse
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={nlText}
                onChange={(e) => setNlText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNLParse()}
                placeholder='e.g. "Pizza at Dominos for 850 yesterday"'
                className="flex-1 bg-white border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={handleNLParse}
                disabled={isNLParsing || !nlText.trim()}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
              >
                {isNLParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Parse'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Toggle */}
            <div className="flex gap-3">
              {['expense', 'income'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: t }))}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all",
                    form.type === t
                      ? t === 'expense' ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {t === 'expense' ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount (PKR)</label>
              <input
                type="number"
                name="amount"
                required
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-border rounded-xl text-xl font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Merchant & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Merchant</label>
                <input
                  type="text"
                  name="merchant"
                  value={form.merchant}
                  onChange={handleChange}
                  placeholder="e.g. Starbucks"
                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description (optional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Any notes..."
                className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : `Save ${form.type.charAt(0).toUpperCase() + form.type.slice(1)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
