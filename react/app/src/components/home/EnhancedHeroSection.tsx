import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Clock, Shield, Star, Zap, ChevronDown, 
  Play, Users, Calendar, Droplets, Thermometer, Paintbrush,
  Sparkles, ArrowRight, CheckCircle2, Navigation, HardHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function EnhancedHeroSection() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: language === 'hi' ? 'भारत का नंबर 1' : 'India\'s #1 Service Platform',
      title: language === 'hi' ? 'कारीगर, जिनका आप \nभरोसा कर सकते हैं' : 'Handpicked Experts \nYou Can Trust',
      subtitle: language === 'hi' ? '60 सेकंड में मैच' : 'Matched in 60 Seconds',
      description: language === 'hi' 
        ? 'सत्यापित पेशेवरों के साथ अपने घर के कामों को आसान बनाएं। कोई छिपी हुई फीस नहीं।'
        : "Turn your home to-do list into a 'done' list with verified professionals.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800", // Cleaning Pro
      color: "from-blue-600/10 to-transparent"
    },
    {
      badge: language === 'hi' ? 'पारदर्शी मूल्य' : 'Pay What You See',
      title: language === 'hi' ? 'प्रीमियम सेवाएं \nकिफायती दामों पर' : 'Premium Help \nAt Fair Prices',
      subtitle: language === 'hi' ? '10% कमीशन मॉडल' : 'Fair 10% Commission',
      description: language === 'hi'
        ? 'बिचौलियों को हटाएं। सीधे कारीगरों के साथ जुड़ें और 30% तक बचत करें।'
        : 'Cut out the middleman. Connect directly with workers and save up to 30%.',
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800", // Electrician Icon
      color: "from-amber-600/10 to-transparent"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    navigate(searchQuery ? `/services?search=${encodeURIComponent(searchQuery)}` : '/services');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px]" />
      
      <div className="container relative z-10 px-4 pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Left */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="outline" className="py-1.5 px-4 border-primary/20 bg-primary/5 text-primary rounded-full font-bold tracking-wide">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                {slides[currentSlide].badge}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
                {slides[currentSlide].title.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {line}
                    {i === 0 && <span className="text-primary italic">.</span>}
                  </span>
                ))}
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
                <div className="h-1 w-12 bg-primary/20 rounded-full" />
                {slides[currentSlide].subtitle}
              </h2>
              <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Premium Search Box */}
            <div className="relative group max-w-2xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col sm:flex-row gap-3 p-3 bg-white border border-slate-100 rounded-[1.8rem] shadow-xl shadow-slate-200/50">
                <div className="flex-1 flex items-center px-4">
                  <Search className="h-6 w-6 text-slate-400 mr-4" />
                  <Input 
                    placeholder={language === 'hi' ? 'सेवा खोजें...' : 'What help do you need?'}
                    className="border-none shadow-none focus-visible:ring-0 text-lg p-0 h-12 h-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearch} className="h-14 px-10 rounded-2xl text-lg font-bold group">
                  Book Professional
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Thekedar CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate('/book/thekedar')}
              className="max-w-2xl p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center justify-between group cursor-pointer hover:bg-emerald-100/50 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                  <HardHat className="h-7 w-7" />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-emerald-900 group-hover:text-emerald-950">
                     {language === 'hi' ? 'ठेकेदार बुक करें (बड़े काम के लिए)' : 'Book a Thekedar (For Big / Complex Work)'}
                   </h4>
                   <p className="text-sm text-emerald-700 font-medium">
                     {language === 'hi' ? 'निरीक्षण, योजना या कई श्रमिकों की आवश्यकता वाले कार्यों के लिए' : 'For work needing inspection, planning or multiple workers'}
                   </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-emerald-500 group-hover:translate-x-2 transition-transform" />
            </motion.div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 pt-6">
              {[
                { label: 'Verified Pros', val: '12,400+', icon: Shield },
                { label: 'Avg Rating', val: '4.9/5', icon: Star },
                { label: 'Happy Users', val: '80k+', icon: Users }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-none">{s.val}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Right */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square rounded-[4rem] bg-slate-100 overflow-hidden shadow-2xl border-8 border-white group"
            >
              <img 
                src={slides[currentSlide].image} 
                alt="Service Professional" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-12 -left-12 bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-50 max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <span className="font-black text-slate-800">Govt. Verified</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">All workers are pre-vetted with Aadhar & Police checks.</p>
              </motion.div>

              {/* Arrival Card */}
              <motion.div
                animate={{ x: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-12 -right-12 bg-slate-900 p-6 rounded-[2rem] shadow-2xl text-white max-w-[220px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <span className="font-bold">Lightning Fast</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                   <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "80%" }} 
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-primary" 
                   />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Avg matching time: 58s</p>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}