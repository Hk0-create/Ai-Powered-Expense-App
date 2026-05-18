import React from 'react';
import { Cpu, RefreshCw, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const AIInsightCard = ({ insight, onRefresh, isLoading, onViewDetail }) => {
  return (
    <div className="bg-indigo-50/40 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/20 hover:bg-indigo-50/60 transition-all duration-300">
      {/* Premium Cognitive Glow decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-125 group-hover:bg-primary/8 transition-transform duration-500" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 tracking-tight">AI Spending Insight</h3>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50 text-primary cursor-pointer"
          title="Refresh Insights"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </button>
      </div>

      <div className="prose prose-sm prose-indigo max-w-none relative z-10 min-h-[60px] flex items-center">
        {isLoading ? (
          <div className="space-y-2.5 w-full">
            <div className="h-3.5 bg-primary/5 rounded-lg animate-pulse w-3/4" />
            <div className="h-3.5 bg-primary/5 rounded-lg animate-pulse w-full" />
            <div className="h-3.5 bg-primary/5 rounded-lg animate-pulse w-5/6" />
          </div>
        ) : (
          <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
            {insight || "No insights available yet. Add more transactions to get AI-powered spending advice."}
          </div>
        )}
      </div>

      <button 
        onClick={onViewDetail}
        className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-2.5 hover:text-primary/85 transition-all cursor-pointer relative z-10"
      >
        VIEW DETAILED ANALYSIS
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AIInsightCard;
