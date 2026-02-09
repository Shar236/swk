import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Shield, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const stats = [
  { value: '50K+', label: 'Workers', labelHi: 'कारीगर' },
  { value: '2L+', label: 'Bookings', labelHi: 'बुकिंग' },
  { value: '4.8', label: 'Rating', labelHi: 'रेटिंग' },
  { value: '45min', label: 'Avg. Time', labelHi: 'औसत समय' },
];

export function HeroSection() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: language === 'hi' ? 'विश्वसनीय कारीगर' : 'Trusted Workers',
      subtitle: language === 'hi' ? '60 सेकंड में' : 'in 60 seconds',
      color: 'from-primary/20 to-primary/5',
    },
    {
      title: language === 'hi' ? 'पारदर्शी मूल्य' : 'Transparent Pricing',
      subtitle: language === 'hi' ? 'केवल 10% कमीशन' : 'Only 10% commission',
      color: 'from-emerald-500/20 to-emerald-500/5',
    },
    {
      title: language === 'hi' ? 'सत्यापित सेवा' : 'Verified Service',
      subtitle: language === 'hi' ? 'KYC सत्यापित कारीगर' : 'KYC verified workers',
      color: 'from-amber-500/20 to-amber-500/5',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br transition-all duration-1000',
          slides[currentSlide].color
        )} />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container px-4 py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span>{language === 'hi' ? 'भारत का विश्वसनीय सर्विस प्लेटफॉर्म' : "Bharat's Trusted Service Platform"}</span>
          </div>

          {/* Animated Title */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-primary">{slides[currentSlide].title}</span>
            <br />
            <span className="text-foreground">{slides[currentSlide].subtitle}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('app.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={language === 'hi' ? 'प्लंबर, इलेक्ट्रीशियन, AC रिपेयर...' : 'Plumber, Electrician, AC Repair...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-14 text-lg rounded-xl border-2 focus:border-primary"
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="h-14 px-8 rounded-xl text-lg font-semibold">
              <Search className="mr-2 h-5 w-5" />
              {t('common.search')}
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
                )}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? stat.labelHi : stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 rounded-full bg-background border px-4 py-2 text-sm">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>{language === 'hi' ? 'सत्यापित कारीगर' : 'Verified Workers'}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-background border px-4 py-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{language === 'hi' ? '45 मिनट में सेवा' : '45-min Service'}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-background border px-4 py-2 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span>{language === 'hi' ? '4.8 रेटिंग' : '4.8 Rating'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
