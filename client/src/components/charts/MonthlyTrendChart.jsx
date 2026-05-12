import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MonthlyTrendChart = ({ data }) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickFormatter={(val) => `PKR ${val > 1000 ? `${(val/1000).toFixed(1)}k` : val}`}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
            }}
          />
          <Legend iconType="circle" />
          <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" barSize={20} />
          <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
