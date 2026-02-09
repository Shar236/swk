import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Star, Clock, Shield, ChevronRight, MapPin, 
  Sparkles, TrendingUp, Zap, Droplets, Hammer, Paintbrush, 
  Settings, HardHat, Info, ArrowRight, CheckCircle2, Home, Shirt, Utensils, GraduationCap
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/useServices';
import { useLanguage } from '@/contexts/LanguageContext';
import { StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/animated-container';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  zap: Zap,
  hammer: Hammer,
  paintbrush: Paintbrush,
  settings: Settings,
  'hard-hat': HardHat,
  sparkles: Sparkles,
  home: Home,
  shirt: Shirt,
  utensils: Utensils,
  'graduation-cap': GraduationCap,
  thermometer: Zap, // Fallback
};

const CATEGORIES = [
  { id: 'all', label: 'All Services', labelHi: 'सभी सेवाएं', icon: Sparkles },
  { id: 'repair', label: 'Repairs', labelHi: 'मरम्मत', icon: Settings },
  { id: 'electric', label: 'Electrical', labelHi: 'बिजली', icon: Zap },
  { id: 'plumbing', label: 'Plumbing', labelHi: 'नलसाजी', icon: Droplets },
  { id: 'construction', label: 'Mazdoor', labelHi: 'मजदूर', icon: HardHat },
  { id: 'tent', label: 'Tent House', labelHi: 'टेंट हाउस', icon: Home },
  { id: 'laundry', label: 'Laundry', labelHi: 'लॉन्ड्री', icon: Shirt }, 
  { id: 'food', label: 'Tiffin', labelHi: 'टिफिन', icon: Utensils },
  { id: 'education', label: 'Helper', labelHi: 'मददगार', icon: GraduationCap },
];

export default function Services() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: services, isLoading } = useServices();
  const { t, language } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((service) => {
      const matchesSearch = !searchQuery || 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.localizedName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || 
        service.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
        service.description.toLowerCase().includes(activeCategory.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, activeCategory]);

  const featuredService = services?.[0];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50">
        {/* Premium Hero Header */}
        <div className="relative overflow-hidden bg-white border-b">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
          
          <div className="container relative px-4 py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <Badge variant="outline" className="mb-4 py-1 px-3 border-primary/20 bg-primary/5 text-primary rounded-full">
                <Sparkles className="h-3 w-3 mr-2" />
                {language === 'hi' ? '60 सेकंड में मैच करें' : 'Match in 60 seconds'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-primary bg-clip-text text-transparent">
                {language === 'hi' ? 'विशेषज्ञ सेवाएं, आपके घर पर' : 'Expert Services, at Your Doorstep'}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
                {language === 'hi' 
                  ? 'भारत का सबसे भरोसेमंद प्लेटफॉर्म पारभासी मूल्य निर्धारण और 24-घंटे सेवा वारंटी के साथ।'
                  : "India's most trusted platform with transparent pricing and 24-hour service warranty."
                }
              </p>

              {/* Enhanced Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder={language === 'hi' ? 'क्या सेवा चाहिए? (जैसे: एसी, नल, पेंट)' : 'What do you need? (e.g. AC, Tap, Paint)'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 border-none bg-transparent shadow-none focus-visible:ring-0 text-lg"
                  />
                </div>
                <Button className="h-14 px-8 rounded-xl text-lg font-bold group">
                  {language === 'hi' ? 'खोजें' : 'Search'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b">
          <div className="container px-4 py-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-medium border",
                    activeCategory === cat.id 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:bg-primary/5"
                  )}
                >
                  <cat.icon className={cn("h-4 w-4", activeCategory === cat.id ? "text-white" : "text-primary")} />
                  {language === 'hi' ? cat.labelHi : cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container px-4 py-12">
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar with Filters/Stats */}
            <div className="hidden lg:block space-y-8">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {language === 'hi' ? 'हमारा वादा' : 'Our Promise'}
                </h3>
                <div className="space-y-4">
                  {[
                    { title: 'Verified Background', icon: Shield, color: 'text-blue-500' },
                    { title: 'Fixed Pricing', icon: CheckCircle2, color: 'text-emerald-500' },
                    { title: '24h Warranty', icon: Info, color: 'text-amber-500' }
                  ].map((p, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <p.icon className={cn("h-5 w-5 mt-0.5", p.color)} />
                      <span className="font-medium text-slate-700">{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-primary text-white overflow-hidden relative">
                <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <CardContent className="p-6 relative">
                  <h4 className="font-bold text-xl mb-2">Need Help Fast?</h4>
                  <p className="text-primary-foreground/80 text-sm mb-4">Chat with our AI assistant for instant recommendations.</p>
                  <Button variant="secondary" className="w-full font-bold">Open Chatbot</Button>
                </CardContent>
              </Card>
            </div>

            {/* Services Grid Content */}
            <div className="lg:col-span-3 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {activeCategory === 'all' 
                      ? (language === 'hi' ? 'सभी उपलब्ध सेवाएं' : 'All Available Services')
                      : (CATEGORIES.find(c => c.id === activeCategory)?.label || 'Services')
                    }
                  </h2>
                  <p className="text-slate-500 font-medium">{filteredServices.length} {language === 'hi' ? 'परिणाम' : 'results'}</p>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-64 rounded-3xl" />
                    ))}
                  </div>
                ) : (
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => {
                      const Icon = iconMap[service.icon] || Settings;
                      return (
                        <StaggerItem key={service.id}>
                          <HoverScale scale={1.02}>
                            <Card
                              onClick={() => navigate(`/book/${service.id}`)}
                              className="group cursor-pointer border-slate-200/60 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl overflow-hidden bg-white"
                            >
                              <div className="relative h-2 w-full" style={{ backgroundColor: service.color }} />
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                  <div
                                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm"
                                    style={{ backgroundColor: `${service.color}15` }}
                                  >
                                    <Icon className="h-7 w-7" style={{ color: service.color }} />
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 text-amber-500 font-bold justify-end">
                                      <Star className="h-4 w-4 fill-amber-500" />
                                      <span>4.8</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">12k+ Booked</p>
                                  </div>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-primary transition-colors">
                                  {service.localizedName}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                                  {service.description}
                                </p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                  <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starting from</p>
                                    <p className="text-lg font-extrabold text-slate-900">₹299</p>
                                  </div>
                                  <Button size="sm" className="rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    Book Now
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </HoverScale>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                )}

                {!isLoading && filteredServices.length === 0 && (
                  <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                      <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No results found</h3>
                    <p className="text-slate-500">We couldn't find any services matching your search. Try a different term.</p>
                  </div>
                )}
              </section>

              {/* Special Offers Section */}
              <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/20 to-transparent" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="bg-white/20 hover:bg-white/30 border-none mb-4">Special Bundle</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Full Home Deep Cleaning</h2>
                    <p className="text-slate-300 mb-6 text-lg">Save up to 30% when you book deep cleaning for 3+ rooms. Limited time offer!</p>
                    <Button variant="secondary" size="lg" className="rounded-xl font-bold px-8">Check Offer</Button>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <div className="h-48 w-48 rounded-3xl bg-white/10 backdrop-blur-3xl flex items-center justify-center rotate-12 border border-white/10 scale-110">
                      <Sparkles className="h-24 w-24 text-primary" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Confidence Section */}
        <div className="bg-white py-20 border-t">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why RAHI is Different</h2>
              <p className="text-slate-600 max-w-2xl mx-auto italic">"We believe in worker dignity as much as customer satisfaction."</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Zap className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">Instant Response</h4>
                <p className="text-slate-600">Average matching time of just 58 seconds. No more waiting hours for calls.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">Quality Guarantee</h4>
                <p className="text-slate-600">Free rework if you're not satisfied. Our workers are vetted professionals.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">Safe & Vetted</h4>
                <p className="text-slate-600">Police verified, ID checks, and background verified for your total peace of mind.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
