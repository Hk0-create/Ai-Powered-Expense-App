import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Download, Plus, Search, Calendar, AlertCircle, Trash2, Edit2, Check, X } from 'lucide-react';
import api from '../api/axiosInstance';
import AddTransactionModal from '../components/shared/AddTransactionModal';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['All', 'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health & Fitness', 'Utilities', 'Housing', 'Education', 'Travel', 'Personal Care', 'Investments', 'Other'];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ page: 1, limit: 20, type: '', category: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.type) params.type = filters.type;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const { data } = await api.get('/transactions', { params });
      setTransactions(data.data.transactions || []);
      setPagination(data.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEditStart = (tx) => {
    setEditingId(tx._id);
    setEditForm({ amount: tx.amount, merchant: tx.merchant || '', category: tx.category, description: tx.description || '' });
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/transactions/${id}`, editForm);
      toast.success('Updated!');
      setEditingId(null);
      fetchTransactions();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">Manage and track all your financial movements.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-border flex-1 min-w-[180px] focus-within:border-primary/40 transition-all">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters(p => ({ ...p, search: e.target.value, page: 1 }))}
            placeholder="Search merchant or description..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {['', 'expense', 'income'].map(t => (
            <button
              key={t}
              onClick={() => setFilters(p => ({ ...p, type: t, page: 1 }))}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                filters.type === t ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
              )}
            >
              {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}
          className="px-3 py-2 bg-slate-50 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
        >
          {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Merchant</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-muted-foreground">
                  <p className="text-sm italic mb-2">No transactions found.</p>
                  <button onClick={() => setShowAddModal(true)} className="text-xs font-bold text-primary hover:underline">
                    + Add your first transaction
                  </button>
                </td>
              </tr>
            ) : transactions.map(tx => (
              <tr key={tx._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  {editingId === tx._id ? (
                    <input
                      className="border border-primary/30 rounded px-2 py-1 text-sm w-36 outline-none"
                      value={editForm.merchant}
                      onChange={e => setEditForm(p => ({ ...p, merchant: e.target.value }))}
                    />
                  ) : (
                    <div>
                      <p className="font-bold text-slate-700">{tx.merchant || 'General'}</p>
                      {tx.description && <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{tx.description}</p>}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {editingId === tx._id ? (
                      <select
                        className="border border-primary/30 rounded px-2 py-1 text-xs outline-none"
                        value={editForm.category}
                        onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                      >
                        {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                      </select>
                    ) : (
                      <>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                          {tx.category}
                        </span>
                        {tx.isAnomalous && (
                          <AlertCircle className="w-4 h-4 text-amber-500" title="Anomalous spending detected" />
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === tx._id ? (
                    <input
                      type="number"
                      className="border border-primary/30 rounded px-2 py-1 text-sm w-24 text-right outline-none font-mono"
                      value={editForm.amount}
                      onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))}
                    />
                  ) : (
                    <span className={cn("font-mono font-bold", tx.type === 'income' ? "text-emerald-600" : "text-slate-900")}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {editingId === tx._id ? (
                      <>
                        <button onClick={() => handleEditSave(tx._id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditStart(tx)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(tx._id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-bold text-foreground">{transactions.length}</span> of{' '}
          <span className="font-bold text-foreground">{pagination.total || 0}</span> results
        </p>
        <div className="flex gap-2">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-40 transition-all"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-muted-foreground">
            {filters.page} / {pagination.pages || 1}
          </span>
          <button
            disabled={filters.page >= (pagination.pages || 1)}
            onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-40 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddTransactionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchTransactions(); }}
        />
      )}
    </div>
  );
};

export default Transactions;
