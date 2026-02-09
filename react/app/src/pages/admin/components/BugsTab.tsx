import React, { useState } from 'react';
import { 
  AlertCircle, 
  Bug, 
  Terminal, 
  ChevronRight, 
  ChevronDown,
  Trash2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorEntry {
  id: string;
  type: 'frontend' | 'backend' | 'api' | 'payment' | 'otp';
  message: string;
  source: string;
  time: string;
  count: number;
  status: 'unresolved' | 'resolved' | 'ignored';
  stack?: string;
}

export const BugsTab: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const errors: ErrorEntry[] = [
    { 
      id: 'err-1', 
      type: 'api', 
      message: 'NetworkError: Failed to fetch http://localhost:8000/api/chat', 
      source: 'ChatAssistant.tsx:71', 
      time: '2 mins ago', 
      count: 14, 
      status: 'unresolved',
      stack: 'TypeError: Failed to fetch\n  at ChatAssistant.sendMessage (ChatAssistant.tsx:71)\n  at onClick (ChatAssistant.tsx:142)'
    },
    { 
      id: 'err-2', 
      type: 'frontend', 
      message: 'ReferenceError: VOICE_PRESETS.RACHEL_PROFESSIONAL is undefined', 
      source: 'ChatAssistant.tsx:40', 
      time: '15 mins ago', 
      count: 1, 
      status: 'resolved' 
    },
    { 
      id: 'err-3', 
      type: 'payment', 
      message: 'PaymentGatewayException: Signature mismatch on callback', 
      source: '/api/v1/payments/verify', 
      time: '45 mins ago', 
      count: 2, 
      status: 'unresolved' 
    },
    { 
      id: 'err-4', 
      type: 'otp', 
      message: 'SMSProviderError: Resource exhausted (limit reached)', 
      source: 'Twilio Integration', 
      time: '1 hour ago', 
      count: 42, 
      status: 'unresolved' 
    },
  ];

  const getStatusIcon = (type: string) => {
    switch(type) {
      case 'frontend': return <Terminal size={14} className="text-blue-500" />;
      case 'backend': return <Bug size={14} className="text-purple-500" />;
      case 'api': return <AlertCircle size={14} className="text-orange-500" />;
      case 'payment': return <MonitorPayment size={14} className="text-red-500" />;
      default: return <Bug size={14} className="text-slate-400" />;
    }
  };

  const MonitorPayment = ({ size, className }: { size: number, className: string }) => (
     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
     </svg>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Bug className="text-red-500" />
              Sentry-Style Error Monitor
           </h2>
           <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Global Platform Exception Logs</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={16} /> All Types
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-all">
              <CheckCircle2 size={16} /> Resolve All
           </button>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardContent className="p-0">
          <div className="divide-y">
            {errors.map((error) => (
              <div key={error.id} className={cn("transition-all", expandedId === error.id ? "bg-slate-50/50" : "hover:bg-slate-50")}>
                <div className="p-4 md:p-6 flex items-start gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === error.id ? null : error.id)}>
                   <div className="mt-1">
                      {expandedId === error.id ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase",
                           error.type === 'frontend' ? "bg-blue-100 text-blue-700" :
                           error.type === 'backend' ? "bg-purple-100 text-purple-700" :
                           error.type === 'api' ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                         )}>
                            {getStatusIcon(error.type)} {error.type}
                         </div>
                         {error.status === 'resolved' ? (
                           <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                              <CheckCircle2 size={10} /> RESOLVED
                           </span>
                         ) : (
                           <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                              <AlertCircle size={10} /> UNRESOLVED
                           </span>
                         )}
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Occurred {error.time}</span>
                      </div>
                      
                      <h4 className="text-base font-black text-slate-900 leading-snug mb-1">{error.message}</h4>
                      <p className="text-xs font-bold text-slate-500 italic">{error.source}</p>
                   </div>

                   <div className="hidden lg:block text-center px-6">
                      <div className="text-xl font-black text-slate-400">{error.count}</div>
                      <div className="text-[10px] font-black uppercase text-slate-300">Events</div>
                   </div>

                   <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-green-100 text-slate-400 hover:text-green-600 rounded-lg transition-colors" title="Resolve">
                         <CheckCircle2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Ignore">
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>

                {expandedId === error.id && (
                  <div className="px-6 pb-6 md:px-16 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-950 rounded-xl p-6 font-mono text-[11px] text-slate-400 border border-slate-800 shadow-inner">
                       <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                          <span className="text-slate-500 font-bold uppercase tracking-widest">Stack Trace Exception Log</span>
                          <button className="text-primary hover:underline font-black uppercase">Copy Stack Trace</button>
                       </div>
                       {error.stack ? (
                         <pre className="whitespace-pre-wrap">{error.stack}</pre>
                       ) : (
                         <p className="italic">No detailed stack trace available for this event.</p>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                       <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impacted Users</div>
                          <div className="text-lg font-black text-slate-900">4 Users</div>
                       </div>
                       <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Browser / Env</div>
                          <div className="text-lg font-black text-slate-900">Chrome (Windows)</div>
                       </div>
                       <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Request Latency</div>
                          <div className="text-lg font-black text-slate-900">1,248 ms</div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-6 bg-slate-50 border-t flex items-center justify-center">
           <button className="text-sm font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">Load Older Exceptions (Historical Data)</button>
        </div>
      </Card>
    </div>
  );
};
