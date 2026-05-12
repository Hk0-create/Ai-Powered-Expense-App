import React from 'react';
import { cn } from '../../lib/utils';

const BudgetGauge = ({ category, cap, spent, percent }) => {
  const isOver = spent > cap && cap > 0;
  
  // Color logic
  const getBarColor = () => {
    if (cap === 0) return "bg-slate-200";
    if (percent >= 100) return "bg-rose-500";
    if (percent >= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-bold text-slate-700">{category}</p>
          <p className="text-[10px] text-muted-foreground">
            {spent.toLocaleString()} / {cap > 0 ? cap.toLocaleString() : 'No Limit'}
          </p>
        </div>
        <div className="text-right">
          <span className={cn(
            "text-xs font-bold",
            isOver ? "text-rose-600" : "text-slate-600"
          )}>
            {percent}%
          </span>
        </div>
      </div>
      
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", getBarColor())}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      
      {isOver && (
        <p className="text-[10px] text-rose-500 font-medium">Over budget by {(spent - cap).toLocaleString()}</p>
      )}
    </div>
  );
};

export default BudgetGauge;
