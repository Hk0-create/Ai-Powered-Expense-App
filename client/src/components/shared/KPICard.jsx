import React from 'react';
import CountUp from 'react-countup';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, prefix = "", suffix = "" }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-card p-6 rounded-xl border border-border card-shadow transition-all hover:border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/5 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trendValue && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-mono tracking-tight">
          {prefix}
          <CountUp end={value} duration={2} separator="," decimals={value % 1 !== 0 ? 2 : 0} />
          {suffix}
        </h3>
      </div>
    </div>
  );
};

export default KPICard;
