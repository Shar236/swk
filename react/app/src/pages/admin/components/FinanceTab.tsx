import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowDownCircle, 
  Download,
  Filter,
  PieChart as PieIcon,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { DataTable } from './DataTable';
import { cn } from '@/lib/utils';

const serviceData = [
  { name: 'AC Service', value: 45000, color: '#f97316' },
  { name: 'Electrical', value: 28000, color: '#6366f1' },
  { name: 'Plumbing', value: 32000, color: '#22c55e' },
  { name: 'Cleaning', value: 18000, color: '#06b6d4' },
];

export const FinanceTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white shadow-xl">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
                 <DollarSign size={14} /> Total Gross Volume
              </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-3xl font-black">₹4,82,900</div>
              <div className="flex items-center gap-1 text-[10px] font-bold mt-2 bg-white/20 w-fit px-2 py-0.5 rounded-full">
                 <TrendingUp size={10} /> +24% vs Prev Month
              </div>
           </CardContent>
        </Card>

        <Card className="shadow-lg">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <ArrowDownCircle size={14} className="text-primary" /> RAHI Commission (8%)
              </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-3xl font-black text-slate-900">₹38,632</div>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Net Platform Earnings</p>
           </CardContent>
        </Card>

        <Card className="shadow-lg">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <CreditCard size={14} className="text-orange-500" /> Pending Payouts
              </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-3xl font-black text-slate-900">₹12,450</div>
              <p className="text-[10px] font-bold text-orange-600 mt-1 uppercase tracking-tighter">Settlement in progress</p>
           </CardContent>
        </Card>

        <Card className="shadow-lg">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <PieIcon size={14} className="text-blue-500" /> Avg. Ticket Size
              </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-3xl font-black text-slate-900">₹1,248</div>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Across all services</p>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
           <CardHeader className="border-b bg-slate-50/50">
              <div className="flex items-center justify-between">
                 <div>
                    <CardTitle className="text-lg font-black">Revenue by Service</CardTitle>
                    <CardDescription>Performance breakdown by category</CardDescription>
                 </div>
                 <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <Filter size={18} className="text-slate-500" />
                 </button>
              </div>
           </CardHeader>
           <CardContent className="pt-8">
              <div className="h-[300px] w-full flex flex-col md:flex-row items-center gap-8">
                 <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={serviceData}
                             innerRadius={60}
                             outerRadius={100}
                             paddingAngle={5}
                             dataKey="value"
                          >
                             {serviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                             formatter={(value) => `₹${Number(value).toLocaleString()}`}
                          />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="space-y-4 min-w-[150px]">
                    {serviceData.map((item, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                          <div className="flex-1">
                             <p className="text-xs font-black text-slate-800">{item.name}</p>
                             <p className="text-[10px] font-bold text-slate-400">₹{item.value.toLocaleString()}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="shadow-lg">
           <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                 <MapPin size={20} className="text-primary" />
                 Geographic Revenue Spread
              </CardTitle>
              <CardDescription>Top performing regions across India</CardDescription>
           </CardHeader>
           <CardContent className="pt-8 space-y-6">
              {[
                 { city: 'New Delhi', amount: 145000, percentage: 75, color: '#6366f1' },
                 { city: 'Mumbai', amount: 89000, percentage: 42, color: '#f97316' },
                 { city: 'Bangalore', amount: 56000, percentage: 28, color: '#22c55e' },
                 { city: 'Gwalior', amount: 42000, percentage: 22, color: '#06b6d4' },
              ].map((loc, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-black text-slate-950 uppercase tracking-tighter">{loc.city}</span>
                       <span className="font-mono font-bold text-slate-600">₹{loc.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                       <div className="h-full rounded-full transition-all duration-1000" style={{width: `${loc.percentage}%`, backgroundColor: loc.color}} />
                    </div>
                 </div>
              ))}
              <div className="pt-4 border-t border-dashed">
                 <button className="text-[10px] font-black text-primary uppercase hover:underline tracking-widest">View Detailed Growth Analytics</button>
              </div>
           </CardContent>
        </Card>
      </div>

      <DataTable 
        title="Transaction History"
        description="Detailed ledger of all financial movements on the platform."
        columns={[
           { key: 'id', label: 'Txn ID', render: (val) => <span className="font-mono text-xs text-slate-400">#{val}</span> },
           { key: 'method', label: 'Payment Method', render: (val) => <span className="flex items-center gap-2"><CreditCard size={12} /> {val}</span> },
           { key: 'amount', label: 'Amount', render: (val) => <span className="font-black text-slate-900">₹{val}</span> },
           { key: 'type', label: 'Type', render: (val) => <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase", val === 'payout' ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700")}>{val}</span> },
           { key: 'status', label: 'Status', render: (val) => <span className="text-green-600 font-bold uppercase text-[10px]">{val}</span> }
        ]}
        data={[
           { id: 'TXN-9281', method: 'UPI (PhonePe)', amount: 1200, type: 'settlement', status: 'success' },
           { id: 'TXN-9282', method: 'Credit Card', amount: 4500, type: 'settlement', status: 'success' },
           { id: 'TXN-9283', method: 'Bank Transfer', amount: 8000, type: 'payout', status: 'success' },
           { id: 'TXN-9284', method: 'UPI (GPay)', amount: 650, type: 'settlement', status: 'success' },
        ]}
      />
    </div>
  );
};
