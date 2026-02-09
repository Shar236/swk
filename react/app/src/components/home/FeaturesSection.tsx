import { Clock, Shield, IndianRupee, MapPin, Star, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Clock,
    titleEn: 'Instant Match',
    titleHi: 'तुरंत मिलान',
    descEn: 'Get connected with verified workers in under 60 seconds',
    descHi: '60 सेकंड में सत्यापित कारीगर से जुड़ें',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Shield,
    titleEn: 'Verified Workers',
    titleHi: 'सत्यापित कारीगर',
    descEn: 'All workers are Aadhaar verified with background checks',
    descHi: 'सभी कारीगर आधार सत्यापित हैं',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: IndianRupee,
    titleEn: 'Fair Pricing',
    titleHi: 'उचित मूल्य',
    descEn: 'Only 8-12% commission - workers earn more',
    descHi: 'केवल 8-12% कमीशन - कारीगर ज्यादा कमाएं',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: MapPin,
    titleEn: 'Live Tracking',
    titleHi: 'लाइव ट्रैकिंग',
    descEn: 'Track your worker in real-time on the map',
    descHi: 'मैप पर कारीगर को रियल-टाइम में ट्रैक करें',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Star,
    titleEn: 'Two-Way Rating',
    titleHi: 'दोतरफा रेटिंग',
    descEn: 'Workers can rate customers too - mutual respect',
    descHi: 'कारीगर भी ग्राहकों को रेट कर सकते हैं',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Users,
    titleEn: 'Worker Welfare',
    titleHi: 'कारीगर कल्याण',
    descEn: '₹2 per booking goes to worker insurance fund',
    descHi: 'हर बुकिंग से ₹2 कारीगर बीमा कोष में',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
];

export function FeaturesSection() {
  const { language } = useLanguage();

  return (
    <section className="py-16 px-4">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {language === 'hi' ? 'राही क्यों चुनें?' : 'Why Choose RAHI?'}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {language === 'hi' 
              ? 'भारत का सबसे विश्वसनीय और न्यायसंगत सर्विस प्लेटफॉर्म'
              : "Bharat's most trusted and fair service platform"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'group p-6 rounded-2xl border-2 bg-card hover:border-primary/30 transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-1',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                'inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110',
                feature.bg
              )}>
                <feature.icon className={cn('h-6 w-6', feature.color)} />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'hi' ? feature.titleHi : feature.titleEn}
              </h3>
              <p className="text-muted-foreground text-sm">
                {language === 'hi' ? feature.descHi : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
