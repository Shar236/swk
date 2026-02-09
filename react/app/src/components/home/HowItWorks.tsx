import { Search, UserCheck, MapPin, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: Search,
    step: 1,
    titleEn: 'Select Service',
    titleHi: 'सेवा चुनें',
    descEn: 'Choose from 10+ service categories',
    descHi: '10+ सेवा श्रेणियों में से चुनें',
    color: 'bg-primary text-primary-foreground',
  },
  {
    icon: UserCheck,
    step: 2,
    titleEn: 'Get Matched',
    titleHi: 'कारीगर खोजें',
    descEn: 'Instant match in 60 seconds',
    descHi: '60 सेकंड में तुरंत मिलान',
    color: 'bg-emerald-500 text-white',
  },
  {
    icon: MapPin,
    step: 3,
    titleEn: 'Track & Verify',
    titleHi: 'ट्रैक और सत्यापित करें',
    descEn: 'Live tracking with OTP verification',
    descHi: 'OTP सत्यापन के साथ लाइव ट्रैकिंग',
    color: 'bg-amber-500 text-white',
  },
  {
    icon: Star,
    step: 4,
    titleEn: 'Pay & Rate',
    titleHi: 'भुगतान और रेटिंग',
    descEn: 'UPI payment with transparent pricing',
    descHi: 'पारदर्शी मूल्य के साथ UPI भुगतान',
    color: 'bg-purple-500 text-white',
  },
];

export function HowItWorks() {
  const { language } = useLanguage();

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {language === 'hi' ? 'यह कैसे काम करता है?' : 'How It Works'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'hi' ? '4 आसान चरणों में सेवा बुक करें' : 'Book a service in 4 easy steps'}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-primary via-emerald-500 via-amber-500 to-purple-500" />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  'relative flex flex-col items-center text-center animate-fade-in'
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Number */}
                <div className={cn(
                  'relative z-10 flex h-16 w-16 items-center justify-center rounded-full mb-4 shadow-lg transition-transform duration-300 hover:scale-110',
                  step.color
                )}>
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 text-xs font-bold">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {language === 'hi' ? step.titleHi : step.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? step.descHi : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
