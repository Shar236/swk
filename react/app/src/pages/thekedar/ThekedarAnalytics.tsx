import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign, 
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  PieChart as PieChartIcon,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 125000, commission: 12500, projects: 12 },
  { month: 'Feb', revenue: 148000, commission: 14800, projects: 15 },
  { month: 'Mar', revenue: 165000, commission: 16500, projects: 18 },
  { month: 'Apr', revenue: 182000, commission: 18200, projects: 20 },
  { month: 'May', revenue: 195000, commission: 19500, projects: 22 },
  { month: 'Jun', revenue: 210000, commission: 21000, projects: 25 },
];

const categoryData = [
  { name: 'AC Services', value: 35, color: '#8b5cf6' },
  { name: 'Home Reno', value: 25, color: '#3b82f6' },
  { name: 'Electrical', value: 20, color: '#f59e0b' },
  { name: 'Plumbing', value: 15, color: '#10b981' },
  { name: 'Others', value: 5, color: '#6366f1' },
];

const workerPerformance = [
  { name: 'Ramesh K.', earnings: 45000, commission: 4500, rating: 4.8 },
  { name: 'Suresh S.', earnings: 38000, commission: 3800, rating: 4.6 },
  { name: 'Amit V.', earnings: 42000, commission: 4200, rating: 4.7 },
  { name: 'Priya G.', earnings: 35000, commission: 3500, rating: 4.9 },
  { name: 'Vikram R.', earnings: 31000, commission: 3100, rating: 4.5 },
];

export default function ThekedarAnalytics() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {language === 'hi' ? 'व्यापार विश्लेषण' : 'Business Analytics'}
            </h1>
            <p className="text-slate-500">
              {language === 'hi' ? 'अपनी टीम के प्रदर्शन और आय का विश्लेषण करें' : 'Deep dive into your team\'s performance and revenue'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" />
            {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
          </Button>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['1m', '3m', '6m', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === range ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', val: '₹10.25L', change: '+12.5%', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Net Commission', val: '₹1.02L', change: '+10.2%', icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Projects', val: '24', change: '+4', icon: Briefcase, color: 'bg-purple-50 text-purple-600' },
          { label: 'Team Size', val: '12', change: '+2', icon: Users, color: 'bg-amber-50 text-amber-600' }
        ].map((s, i) => (
          <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold">
                  {s.change}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</h3>
              <p className="text-3xl font-black text-slate-900 mt-1">{s.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Mix Chart */}
        <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Revenue vs Commission Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    formatter={(v) => [`₹${Number(v).toLocaleString()}`, '']}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" />
                  <Bar dataKey="revenue" name="Total Revenue" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                  <Area type="monotone" dataKey="commission" name="Your Commission" fill="#10b981" stroke="#10b981" fillOpacity={0.1} strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Share */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Service Mix
            </CardTitle>
            <CardDescription>Distribution by service category</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{backgroundColor: item.color}} />
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Worker Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Efficiency
            </CardTitle>
            <CardDescription>Top performing workers this period</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Worker</th>
                    <th className="px-6 py-4">Total Earning</th>
                    <th className="px-6 py-4">Commission</th>
                    <th className="px-6 py-4">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workerPerformance.map((w, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {w.name[0]}
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{w.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black">₹{w.earnings.toLocaleString()}</td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">₹{w.commission.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-amber-50 text-amber-600 border-amber-100">★ {w.rating}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Project Velocity
            </CardTitle>
            <CardDescription>Projects completed month over month</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                   <defs>
                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                  <Area type="monotone" dataKey="projects" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorProjects)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Insight: Demand Increasing</h4>
                  <p className="text-sm text-slate-500 mt-1">Your project volume has increased by 110% over the last 6 months. Consider adding 2 more workers to maintain quality.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center pt-8">
        <Button onClick={() => navigate('/thekedar/team')} className="rounded-2xl h-14 px-12 text-lg font-bold shadow-xl shadow-primary/20">
          Scale My Team
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}