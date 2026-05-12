import React from 'react';
import { Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const AIInsightCard = ({ insight, onRefresh, isLoading }) => {
  return (
    <div className="bg-indigo-50/50 border border-primary/20 rounded-xl p-6 relative overflow-hidden group">
      {/* Decorative background sparkle */}
      <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 -rotate-12 transition-transform group-hover:scale-110" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-primary">AI Spending Insight</h3>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4 text-primary", isLoading && "animate-spin")} />
        </button>
      </div>

      <div className="prose prose-sm prose-indigo max-w-none">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-primary/5 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-primary/5 rounded animate-pulse w-full" />
            <div className="h-4 bg-primary/5 rounded animate-pulse w-5/6" />
          </div>
        ) : (
          <p className="text-sm text-slate-700 leading-relaxed italic">
            {insight || "No insights available yet. Add more transactions to get AI-powered spending advice."}
          </p>
        )}
      </div>

      <button className="mt-4 flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all">
        VIEW DETAILED ANALYSIS
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default AIInsightCard;
