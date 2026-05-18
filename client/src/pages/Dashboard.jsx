import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, Plus, RefreshCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import KPICard from '../components/shared/KPICard';
import AIInsightCard from '../components/shared/AIInsightCard';
import CategoryDonut from '../components/charts/CategoryDonut';
import AddTransactionModal from '../components/shared/AddTransactionModal';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSpent: 0, totalIncome: 0, netBalance: 0, savingsRate: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [transRes, categoryRes, monthlySummaryRes, aiRes] = await Promise.allSettled([
        api.get('/transactions?limit=5'),
        api.get('/transactions/summary/category'),
        api.get('/transactions/summary/monthly'),
        api.get('/ai/insight/latest'),
      ]);

      // Recent transactions
      if (transRes.status === 'fulfilled') {
        setRecentTransactions(transRes.value.data.data.transactions || []);
      }

      // Category chart data
      if (categoryRes.status === 'fulfilled') {
        setCategoryData((categoryRes.value.data.data || []).map(item => ({
          name: item._id,
          value: item.total
        })));
      }

      // Monthly summary for KPI cards — REAL data only, no mock fallbacks
      if (monthlySummaryRes.status === 'fulfilled') {
        const monthly = monthlySummaryRes.value.data.data || [];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        let income = 0, expense = 0;
        monthly.forEach(item => {
          if (item._id.month === currentMonth && item._id.year === currentYear) {
            if (item._id.type === 'income') income = item.total;
            if (item._id.type === 'expense') expense = item.total;
          }
        });

        setStats({
          totalSpent: expense,
          totalIncome: income,
          netBalance: income - expense,
          savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0
        });
      }

      // AI insight
      if (aiRes.status === 'fulfilled' && aiRes.value.data.data) {
        setAiInsight(aiRes.value.data.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const refreshInsight = async () => {
    try {
      setIsInsightLoading(true);
      const { data } = await api.post('/ai/insight/refresh');
      setAiInsight(data.data);
    } catch (error) {
      console.error('Error refreshing insight:', error);
    } finally {
      setIsInsightLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-sm text-muted-foreground">Track your performance and AI-powered insights.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Income" value={stats.totalIncome} icon={ArrowUpCircle} prefix="PKR " trend="up" trendValue={null} />
        <KPICard title="Total Spent" value={stats.totalSpent} icon={ArrowDownCircle} prefix="PKR " trend="down" trendValue={null} />
        <KPICard title="Net Balance" value={stats.netBalance} icon={Wallet} prefix="PKR " />
        <KPICard title="Savings Rate" value={stats.savingsRate} icon={TrendingUp} suffix="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Category Distribution</h3>
          {categoryData.length > 0 ? (
            <CategoryDonut data={categoryData} />
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
              <p className="text-sm italic">No expense data for this month.</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add your first expense
              </button>
            </div>
          )}
        </div>

        {/* AI Insight and Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <AIInsightCard insight={aiInsight} onRefresh={refreshInsight} isLoading={isInsightLoading} onViewDetail={() => navigate('/analytics')} />

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Recent Transactions</h3>
              <button 
                onClick={() => navigate('/transactions')} 
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {tx.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{tx.merchant || tx.description || 'General'}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold font-mono", tx.type === 'income' ? "text-emerald-600" : "text-foreground")}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-sm italic">No transactions yet.</p>
                  <button onClick={() => setShowAddModal(true)} className="mt-2 text-xs font-bold text-primary hover:underline">
                    + Add your first transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => { setShowAddModal(false); fetchDashboardData(); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
