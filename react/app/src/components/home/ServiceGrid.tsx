import { useNavigate } from 'react-router-dom';
import { 
  Droplets, Zap, Hammer, Paintbrush, Grid3X3, Settings, 
  HardHat, Tent, Sparkles, Thermometer, ChevronRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/useServices';
import { useLanguage } from '@/contexts/LanguageContext';
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

export function ServiceGrid() {
  const navigate = useNavigate();
  const { data: services, isLoading } = useServices();
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{t('services.title')}</h2>
            <p className="text-muted-foreground mt-1">
              {language === 'hi' ? '10+ सेवाएं उपलब्ध' : '10+ services available'}
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/services')} className="hidden sm:flex">
            {t('services.view_all')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {services?.map((service, index) => {
            const Icon = iconMap[service.icon] || Settings;
            return (
              <Card
                key={service.id}
                onClick={() => navigate(`/book/${service.id}`)}
                className={cn(
                  'group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300',
                  'hover:shadow-lg hover:-translate-y-1',
                  'animate-fade-in'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: service.color }} />
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {service.localizedName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" onClick={() => navigate('/services')}>
            {t('services.view_all')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
