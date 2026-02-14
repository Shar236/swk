import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Droplets,
  Zap,
  Hammer,
  Paintbrush,
  Grid3X3,
  Settings,
  HardHat,
  Tent,
  Sparkles,
  Thermometer,
  ChevronRight,
  Star,
  ArrowRight,
  Shield,
  Heart
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
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
  const { data, isLoading } = useServices();
  const { language } = useLanguage();

  const [services, setServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // 🔥 KEEP PREVIOUS DATA (Prevents disappearing issue)
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setServices(data);
    }
  }, [data]);

  // 🔥 SAFE FILTERING
  const filteredServices = useMemo(() => {
    if (!services || services.length === 0) return [];

    if (activeCategory === 'all') {
      return services.slice(0, 10);
    }

    return services
      .filter((s) =>
        s.category?.toLowerCase() === activeCategory
      )
      .slice(0, 10);
  }, [services, activeCategory]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container px-4">

        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900">
              Popular Services
            </h2>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/services')}
          >
            Explore All Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-10 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl font-semibold border transition",
                activeCategory === cat.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 border-slate-200"
              )}
            >
              <cat.icon className="h-4 w-4" />
              {language === 'hi' ? cat.labelHi : cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {isLoading && services.length === 0 && (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
            ))
          )}

          {!isLoading && filteredServices.length === 0 && (
            <div className="col-span-full text-center text-slate-400 py-20">
              No services found.
            </div>
          )}

          {filteredServices.map((service) => {
            const Icon = iconMap[service.icon] || Settings;

            return (
              <StaggerItem key={service.id}>
                <HoverScale scale={1.03}>
                  <Card
                    onClick={() => navigate(`/book/${service.id}`)}
                    className="cursor-pointer rounded-3xl border hover:border-primary transition"
                  >
                    <CardContent className="p-6 flex flex-col h-full">

                      <div className="mb-6">
                        <div
                          className="h-14 w-14 flex items-center justify-center rounded-2xl"
                          style={{ backgroundColor: `${service.color}20` }}
                        >
                          <Icon
                            className="h-6 w-6"
                            style={{ color: service.color }}
                          />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mb-2">
                        {service.localizedName}
                      </h3>

                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-bold text-slate-900">
                          ₹299
                        </span>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>

                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-10 bg-slate-900 text-white rounded-3xl flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8" />
            <div>
              <h4 className="text-xl font-bold">
                Your Trust, Our Priority
              </h4>
              <p className="text-slate-400 text-sm">
                Every professional is verified.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
