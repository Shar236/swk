import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Wallet, Briefcase, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface EarningsCardProps {
  todayEarnings: number;
  weekEarnings: number;
  totalEarnings: number;
  walletBalance: number;
  totalJobs: number;
  rating: number;
}

export function EarningsCard({
  todayEarnings,
  weekEarnings,
  totalEarnings,
  walletBalance,
  totalJobs,
  rating,
}: EarningsCardProps) {
  const { t } = useLanguage();

  const stats = [
    {
      label: t('worker.earnings_today'),
      value: `₹${todayEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Wallet Balance',
      value: `₹${walletBalance.toLocaleString()}`,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: t('worker.total_jobs'),
      value: totalJobs.toString(),
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: t('worker.rating'),
      value: rating > 0 ? rating.toFixed(1) : 'New',
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
