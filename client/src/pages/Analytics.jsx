import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import api from '../api/axiosInstance';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import CategoryDonut from '../components/charts/CategoryDonut';
import { cn } from '../lib/utils';

const Analytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const [trendRes, categoryRes] = await Promise.all([
        api.get('/transactions/summary/monthly'),
        api.get('/transactions/summary/category')
      ]);

      // Process trend data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const processedTrends = trendRes.data.data.reduce((acc, curr) => {
        const monthName = months[curr._id.month - 1];
        let existing = acc.find(a => a.name === monthName);
        if (!existing) {
          existing = { name: monthName, income: 0, expense: 0 };
          acc.push(existing);
        }
        existing[curr._id.type] = curr.total;
        return acc;
      }, []);

      setTrendData(processedTrends);
      setCategoryData(categoryRes.data.data.map(item => ({
        name: item._id,
        value: item.total
      })));

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Analytics</h1>
          <p className="text-sm text-muted-foreground">Deep dive into your spending habits and trends.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50">
            <Calendar className="w-4 h-4" />
            Last 12 Months
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 shadow-md">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Income vs Expense Trend
            </h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                Income
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-rose-500 rounded-full" />
                Expense
              </div>
            </div>
          </div>
          <MonthlyTrendChart data={trendData} />
        </div>

        <div className="lg:col-span-1 bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold flex items-center gap-2 mb-8">
            <PieIcon className="w-5 h-5 text-indigo-500" />
            Category Breakdown
          </h3>
          <CategoryDonut data={categoryData} />
          <div className="mt-6 space-y-3">
             {categoryData.slice(0, 4).map((item, idx) => (
               <div key={item.name} className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <span className="text-xs font-medium text-slate-600">{item.name}</span>
                 </div>
                 <span className="text-xs font-bold">PKR {item.value.toLocaleString()}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Highest Spend Month', value: 'March', trend: 'up', color: 'text-rose-600' },
          { label: 'Avg Monthly Saving', value: 'PKR 12,400', trend: 'up', color: 'text-emerald-600' },
          { label: 'Top Category', value: 'Food & Dining', trend: 'down', color: 'text-indigo-600' },
          { label: 'Annual Savings', value: 'PKR 148,800', trend: 'up', color: 'text-emerald-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <span className={cn("text-lg font-bold", stat.color)}>{stat.value}</span>
              {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
