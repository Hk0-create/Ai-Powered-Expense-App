import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCcw, 
  AlertCircle,
  TrendingUp,
  Target,
  Cpu
} from 'lucide-react';
import api from '../api/axiosInstance';
import BudgetGauge from '../components/shared/BudgetGauge';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health & Fitness', 'Utilities', 'Housing', 'Education',
  'Travel', 'Personal Care', 'Investments', 'Other'
];

const Budget = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [vsActual, setVsActual] = useState(null);
  const [advice, setAdvice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const [budgetRes, vsActualRes, advisorRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/budgets/vs-actual'),
        api.get('/budgets/advisor')
      ]);
      
      setBudgetData(budgetRes.data.data);
      setVsActual(vsActualRes.data.data);
      setAdvice(advisorRes.data.data);
    } catch (error) {
      console.error('Error fetching budget data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateBudget = async () => {
    try {
      setIsSaving(true);
      await api.put('/budgets', {
        globalCap: budgetData.globalCap,
        categories: budgetData.categories
      });
      toast.success('Budget limits updated!');
      fetchData(); // Refresh actuals
    } catch (error) {
      toast.error('Failed to update budget');
    } finally {
      setIsSaving(false);
    }
  };

  const updateCategoryCap = (cat, val) => {
    const newCats = { ...budgetData.categories };
    newCats[cat] = Number(val);
    setBudgetData({ ...budgetData, categories: newCats });
  };

  if (isLoading) return <div className="p-10 text-center text-sm font-semibold">Loading Budget...</div>;

  if (hasError || !budgetData || !vsActual) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-red-100 rounded-2xl shadow-lg text-center space-y-5">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Failed to Load Budget Data</h2>
        <p className="text-sm text-slate-500">
          There was an issue communicating with the server. Please verify your connection or check the server status.
        </p>
        <button 
          onClick={fetchData}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budget Manager</h1>
          <p className="text-sm text-muted-foreground">Set spending limits and get AI-powered saving advice.</p>
        </div>
        <button 
          onClick={handleUpdateBudget}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Advisor & Global Cap */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Global Monthly Limit
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <p className="text-xs text-indigo-100 mb-1 uppercase font-bold tracking-wider">Total Monthly Cap</p>
                <input 
                  type="number"
                  value={budgetData.globalCap}
                  onChange={(e) => setBudgetData({ ...budgetData, globalCap: Number(e.target.value) })}
                  className="bg-transparent border-none text-3xl font-bold outline-none w-full"
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-100">Total Spent:</span>
                <span className="font-bold">PKR {vsActual?.totalSpent.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 space-y-4 hover:border-primary/20 transition-all duration-300">
            <h3 className="font-bold flex items-center gap-2.5 text-primary">
              <Cpu className="w-5 h-5" />
              AI Budget Advisor
            </h3>
            <div className="prose prose-sm italic text-slate-600 leading-relaxed font-medium">
              {advice || "Generating advice..."}
            </div>
          </div>
        </div>

        {/* Right Column: Category Budgets */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Category Spending Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {vsActual?.categories.map((item) => {
              const currentCap = budgetData?.categories?.[item.category] ?? 0;
              const currentSpent = item.spent;
              const currentRemaining = Math.max(0, currentCap - currentSpent);
              const currentPercent = currentCap > 0 ? Math.min(100, Math.round((currentSpent / currentCap) * 100)) : 0;
              
              const dynamicItem = {
                ...item,
                cap: currentCap,
                remaining: currentRemaining,
                percent: currentPercent
              };

              return (
                <div key={item.category} className="space-y-3">
                  <BudgetGauge {...dynamicItem} globalCap={budgetData?.globalCap} />
                  <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-border focus-within:border-primary/30 transition-all">
                    <span className="text-xs font-bold text-muted-foreground mr-2">CAP:</span>
                    <input 
                      type="number"
                      value={budgetData.categories[item.category] || 0}
                      onChange={(e) => updateCategoryCap(item.category, e.target.value)}
                      className="bg-transparent border-none outline-none text-sm font-bold w-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
