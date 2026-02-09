import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Landmark, Wallet, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface PaymentOption {
  id: string;
  name: string;
  nameHi?: string;
  icon: any;
  description: string;
  descriptionHi?: string;
  color: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'upi',
    name: 'UPI (GPay, PhonePe, Paytm)',
    nameHi: 'यूपीआई (जीपे, फोनपे, पेटीएम)',
    icon: Smartphone,
    description: 'Instant payment via any UPI app',
    descriptionHi: 'किसी भी यूपीआई ऐप के जरिए तुरंत भुगतान',
    color: 'emerald'
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    nameHi: 'क्रेडिट / डेबिट कार्ड',
    icon: CreditCard,
    description: 'Visa, Mastercard, RuPay supported',
    descriptionHi: 'वीजा, मास्टरकार्ड, रुपे समर्थित',
    color: 'blue'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    nameHi: 'नेट बैंकिंग',
    icon: Landmark,
    description: 'All major Indian banks supported',
    descriptionHi: 'सभी प्रमुख भारतीय बैंक समर्थित',
    color: 'amber'
  },
  {
    id: 'wallet',
    name: 'RAHI Wallet',
    nameHi: 'राही वॉलेट',
    icon: Wallet,
    description: 'Fastest 1-tap checkout',
    descriptionHi: 'सबसे तेज़ 1-टैप चेकआउट',
    color: 'primary'
  }
];

interface PaymentGatewayCardProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  language?: 'en' | 'hi';
}

export function PaymentGatewayCard({ selectedId, onSelect, language = 'en' }: PaymentGatewayCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {paymentOptions.map((option) => {
        const isSelected = selectedId === option.id;
        const Icon = option.icon;
        
        return (
          <motion.div
            key={option.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "group cursor-pointer border-2 transition-all duration-300 rounded-[2rem] overflow-hidden",
              isSelected 
                ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                : "border-slate-100 bg-white hover:border-slate-300"
            )}
          >
            <div className="p-6 flex items-center gap-5">
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
                isSelected ? "bg-primary text-white" : "bg-slate-50 text-slate-400"
              )}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className={cn("font-bold text-lg", isSelected ? "text-primary" : "text-slate-700")}>
                  {language === 'hi' ? option.nameHi : option.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {language === 'hi' ? option.descriptionHi : option.description}
                </p>
              </div>
              <div className={cn(
                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                isSelected ? "border-primary bg-primary" : "border-slate-200"
              )}>
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
