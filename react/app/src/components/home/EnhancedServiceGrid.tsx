import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, Zap, Hammer, Paintbrush, Grid3X3, Settings, 
  HardHat, Tent, Sparkles, Thermometer, ChevronRight, Star, 
  ArrowRight, Shield, Clock, TrendingUp, Heart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useServices } from '@/hooks/useServices';
import { useLanguage } from '@/contexts/LanguageContext';
import { StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/animated-container';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  zap: Zap,
  hammer: Hammer,
  paintbrush: Paintbrush,
  'grid-3x3': Grid3X3,
  settings: Settings,
  'hard-hat': HardHat,
  tent: Tent,
  sparkles: Sparkles,
  thermometer: Thermometer,
};

const CATEGORIES = [
  { id: 'all', label: 'All', labelHi: 'सभी', icon: Grid3X3 },
  { id: 'repair', label: 'Repairs', labelHi: 'मरम्मत', icon: Settings },
  { id: 'cleaning', label: 'Cleaning', labelHi: 'सफाई', icon: Droplets },
  { id: 'home', label: 'Home', labelHi: 'घर', icon: Hammer }
];

export function EnhancedServiceGrid() {
  const navigate = useNavigate();
  const { data: services, isLoading } = useServices();
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (activeCategory === 'all') return services.slice(0, 10);
    return services.filter(s => 
      s.name.toLowerCase().includes(activeCategory) || 
      s.description.toLowerCase().includes(activeCategory)
    ).slice(0, 10);
  }, [services, activeCategory]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-slate-50/50 -z-10" />
      
      <div className="container px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-widest mb-4">
              <TrendingUp className="h-3.5 w-3.5" /> Highly Requested
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Popular Services <br />
              <span className="text-primary italic">Right at your door.</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/services')}
              className="group rounded-2xl h-14 px-8 border-slate-200 font-bold hover:border-primary hover:text-primary transition-all duration-500"
            >
              Explore All Services
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Button>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-500 font-bold border",
                activeCategory === cat.id 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" 
                  : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <cat.icon className={cn("h-4 w-4", activeCategory === cat.id ? "text-primary" : "text-slate-400")} />
              {language === 'hi' ? cat.labelHi : cat.label}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
            ))
          ) : (
            filteredServices.map((service, idx) => {
              const Icon = iconMap[service.icon] || Settings;
              return (
                <StaggerItem key={service.id}>
                  <HoverScale scale={1.03}>
                    <Card
                      onClick={() => navigate(`/book/${service.id}`)}
                      className="group cursor-pointer border-slate-100 hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:shadow-primary/5 h-full flex flex-col"
                    >
                      <CardContent className="p-7 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                            style={{ backgroundColor: `${service.color}15` }}
                          >
                            <Icon className="h-8 w-8" style={{ color: service.color }} />
                          </div>
                          <button className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-2">
                             <div className="flex text-amber-500">
                               <Star className="h-3 w-3 fill-current" />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.8 Rating</span>
                          </div>
                          <h3 className="text-xl font-black mb-2 text-slate-800 group-hover:text-primary transition-colors leading-tight">
                            {service.localizedName}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                            {service.description}
                          </p>
                        </div>
                        
                        <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting at</span>
                            <span className="text-lg font-black text-slate-900">₹299</span>
                          </div>
                          <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                            <ChevronRight className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverScale>
                </StaggerItem>
              );
            })
          )}
        </StaggerContainer>

        {/* Confidence Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 md:p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/20 blur-[100px]" />
          <div className="relative z-10 flex gap-6 items-center">
            <div className="h-16 w-16 rounded-[1.5rem] bg-white text-slate-900 flex items-center justify-center shadow-2xl shadow-primary/20">
              <Shield className="h-8 w-8 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-2xl font-black mb-1">Your Trust, Our Priority.</h4>
              <p className="text-slate-400 font-medium">Every professional is verified with a 23-point background check.</p>
            </div>
          </div>
          <Button variant="secondary" size="lg" className="rounded-2xl font-black h-14 px-10 relative z-10 shadow-lg group">
            LEARN MORE
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}