import React from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  onSearch?: (term: string) => void;
  onFilter?: () => void;
  loading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  description, 
  columns, 
  data, 
  onSearch, 
  onFilter,
  loading 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 font-medium">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-full md:w-64"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            <button 
              onClick={onFilter}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    {col.label}
                    <ArrowUpDown size={12} className="text-slate-300" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({length: 5}).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 font-medium italic">
                  No records found matching your criteria
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm font-bold text-slate-700">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 rounded-md hover:bg-slate-200 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Showing <span className="text-slate-900">{data.length}</span> of <span className="text-slate-900">1,234</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="p-1 border rounded bg-white hover:bg-slate-50 disabled:opacity-50" disabled>
            <ChevronLeft size={18} />
          </button>
          <button className="p-1 border rounded bg-white hover:bg-slate-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
