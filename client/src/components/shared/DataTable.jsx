import React from 'react';
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';

const DataTable = ({ columns, data, onEdit, onDelete, onView }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-border">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => (
              <tr 
                key={row._id || idx} 
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="text-sm font-medium text-slate-700">
                        {row[col.key]}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onView?.(row)}
                      className="p-1.5 hover:bg-slate-100 rounded text-muted-foreground hover:text-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit?.(row)}
                      className="p-1.5 hover:bg-slate-100 rounded text-muted-foreground hover:text-amber-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete?.(row)}
                      className="p-1.5 hover:bg-slate-100 rounded text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="group-hover:hidden">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground ml-auto" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground italic">No data found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
