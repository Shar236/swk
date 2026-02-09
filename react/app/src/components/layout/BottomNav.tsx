import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User, Briefcase, Wallet, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function BottomNav() {
  const location = useLocation();
  const { profile } = useAuth();
  const { language } = useLanguage();

  const customerLinks = [
    { href: '/', icon: Home, labelEn: 'Home', labelHi: 'होम' },
    { href: '/services', icon: Search, labelEn: 'Services', labelHi: 'सेवाएं' },
    { href: '/bookings', icon: Calendar, labelEn: 'Bookings', labelHi: 'बुकिंग' },
    { href: '/help', icon: HelpCircle, labelEn: 'Help', labelHi: 'मदद' },
  ];

  const workerLinks = [
    { href: '/worker/dashboard', icon: Home, labelEn: 'Home', labelHi: 'होम' },
    { href: '/worker/jobs', icon: Briefcase, labelEn: 'Jobs', labelHi: 'काम' },
    { href: '/worker/earnings', icon: Wallet, labelEn: 'Earnings', labelHi: 'कमाई' },
    { href: '/profile', icon: User, labelEn: 'Profile', labelHi: 'प्रोफ़ाइल' },
  ];

  const links = profile?.role === 'worker' ? workerLinks : customerLinks;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 md:hidden flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-slate-900/40 border border-white/10 pointer-events-auto max-w-sm w-full"
      >
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className="relative flex-1 group"
            >
              <div className={cn(
                "flex flex-col items-center gap-1 py-3 px-1 rounded-2xl transition-all duration-300",
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <link.icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "scale-110" : "scale-100 group-hover:scale-110"
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {language === 'hi' ? link.labelHi : link.labelEn}
                </span>
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
