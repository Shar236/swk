import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Clock, Calendar, Zap, AlertTriangle, 
  ChevronRight, Check, Loader2, Shield, Star, IndianRupee,
  User, Phone, MessageSquare, X, Info, Sparkles, Navigation, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';
// import { supabase } from '@/integrations/supabase/client';
import { db } from '@/lib/db';
import { FadeIn, HoverScale, ScaleIn } from '@/components/ui/animated-container';
import { cn } from '@/lib/utils';
import { 
  Droplets, Zap as ZapIcon, Hammer, Paintbrush, Grid3X3, Settings, 
  HardHat, Tent, Thermometer 
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import LocationPicker from '../components/LocationPicker';
import { SERVICE_DATA_MAP, ServiceItem } from '@/data/services/detailedServices';

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  zap: ZapIcon,
  hammer: Hammer,
  paintbrush: Paintbrush,
  'grid-3x3': Grid3X3,
  settings: Settings,
  'hard-hat': HardHat,
  tent: Tent,
  sparkles: Sparkles,
  thermometer: Thermometer,
};

const fallbackServices = [
  { id: 'ac-repair', name: 'AC Repair', name_hi: 'एसी मरम्मत', icon: 'thermometer', color: '#3b82f6', localizedName: 'AC Repair', description: 'AC installation, repair & servicing' },
  { id: 'plumbing', name: 'Plumbing', name_hi: 'प्लंबिंग', icon: 'droplets', color: '#06b6d4', localizedName: 'Plumbing', description: 'Pipe repair, leakage & installation' },
  { id: 'electrical', name: 'Electrical', name_hi: 'बिजली का काम', icon: 'zap', color: '#f59e0b', localizedName: 'Electrical', description: 'Wiring, repair & installation' },
  { id: 'carpentry', name: 'Carpentry', name_hi: 'बढ़ईगीरी', icon: 'hammer', color: '#8b5cf6', localizedName: 'Carpentry', description: 'Furniture repair & woodwork' },
  { id: 'painting', name: 'Painting', name_hi: 'पेंटिंग', icon: 'paintbrush', color: '#ec4899', localizedName: 'Painting', description: 'Wall painting & polishing' },
  { id: 'cleaning', name: 'Cleaning', name_hi: 'सफाई', icon: 'sparkles', color: '#10b981', localizedName: 'Cleaning', description: 'Home & office cleaning' },
  { id: 'appliance-repair', name: 'Appliance Repair', name_hi: 'उपकरण मरम्मत', icon: 'settings', color: '#6366f1', localizedName: 'Appliance Repair', description: 'TV, Fridge, Washing machine repair' },
  { id: 'construction', name: 'Construction', name_hi: 'निर्माण', icon: 'hard-hat', color: '#f97316', localizedName: 'Construction', description: 'Civil work & renovation' },
  { id: 'thekedar', name: 'Thekedar', name_hi: 'ठेकेदार', icon: 'hard-hat', color: '#10b981', localizedName: 'Thekedar', description: 'Big / Complex work planning' },
];

type BookingType = 'instant' | 'scheduled' | 'emergency';

export default function BookService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: services } = useServices();
  const { t, language } = useLanguage();
  const { subscribeToBooking } = useNotifications();
  
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState<BookingType>('instant');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number; lng: number} | null>(null);
  const [searching, setSearching] = useState(false);
  const [workerFound, setWorkerFound] = useState(false);
  const [newBookingId, setNewBookingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);

  // Get detailed items for the current service
  const detailedItems = useMemo(() => {
    const key = serviceId?.toLowerCase();
    if (key?.includes('plumbing')) return SERVICE_DATA_MAP.plumbing;
    if (key?.includes('electrical') || key?.includes('electrician')) return SERVICE_DATA_MAP.electrical;
    if (key?.includes('carpentry') || key?.includes('carpenter')) return SERVICE_DATA_MAP.carpentry;
    if (key?.includes('painting') || key?.includes('painter')) return SERVICE_DATA_MAP.painting;
    if (key?.includes('ac-repair') || key?.includes('ac-services')) return SERVICE_DATA_MAP['ac-repair'];
    if (key?.includes('thekedar')) return SERVICE_DATA_MAP.thekedar;
    return null;
  }, [serviceId]);

  // If detailed items exist, we have 4 steps, otherwise 3
  const hasSubItems = !!detailedItems;
  const totalSteps = hasSubItems ? 4 : 3;

  const findService = (serviceList: any[], id: string | undefined) => {
    if (!id) return null;
    
    // 1. Exact ID match (covers UUIDs)
    const exactMatch = serviceList.find(s => s.id === id);
    if (exactMatch) return exactMatch;

    // 2. Slug match
    const slugMatch = serviceList.find(s => {
      const slug = s.name.toLowerCase().replace(/\s+/g, '-');
      return slug === id;
    });
    if (slugMatch) return slugMatch;

    // 3. Common aliases / Fuzzy match
    const normalizedId = id.toLowerCase().replace(/-/g, ' ');
    const fuzzyMatch = serviceList.find(s => {
      const name = s.name.toLowerCase();
      // Handle common variations
      if (normalizedId === 'electrician' && name === 'electrical') return true;
      if (normalizedId === 'plumber' && name === 'plumbing') return true;
      if (normalizedId === 'carpenter' && name === 'carpentry') return true;
      if (normalizedId === 'painter' && name === 'painting') return true;
      
      return name.includes(normalizedId) || normalizedId.includes(name);
    });
    
    return fuzzyMatch || null;
  };

  const service = useMemo(() => {
    return (services && services.length > 0 
      ? findService(services, serviceId) 
      : null) || findService(fallbackServices, serviceId);
  }, [services, serviceId]);

  const Icon = service ? iconMap[service.icon] || Settings : Settings;

  const priceDetails = useMemo(() => {
    const base = selectedItem ? selectedItem.price : 299;
    const fee = Math.round(base * 0.1);
    const total = base + fee;
    return { base, fee, total, workerShare: Math.round(base * 0.8) };
  }, [selectedItem]);

  useEffect(() => {
    if (!user) {
      toast.error(language === 'hi' ? 'कृपया पहले लॉगिन करें' : 'Please login first');
      navigate('/');
    }
  }, [user, navigate, language]);

  const handleBooking = async () => {
    if (!address) {
      toast.error(language === 'hi' ? 'कृपया पता दर्ज करें' : 'Please enter address');
      return;
    }

    setSearching(true);
    
    // Simulate searching for a worker
    setTimeout(() => {
      setSearching(false);
      setWorkerFound(true);
      toast.success(language === 'hi' ? 'प्रोफेशनल मिल गया!' : 'Professional found!');
    }, 3000);
  };

  const confirmBookingAndNavigate = async () => {
    try {
      // Find category ID from database or use a fallback
      let categoryId = service?.id;
      
      // If the service is from fallbackServices or has a slug ID, find its real UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      if (service && (!categoryId || !uuidRegex.test(categoryId || ''))) {
        const { data: catData } = await db
          .collection('service_categories')
          .select('id')
          .ilike('name', service.name)
          .single(); // Using single() as maybeSingle() might not be in our custom client yet, or we'll assume it handles it.
          // Actually, let's check db.ts again. It has single(). 
          // But wait, the original code used maybeSingle(). 
          // Our db.ts single() returns { data: T | null, error: any }.
          // So it effectively acts like maybeSingle if it doesn't throw on no rows.
          // Let's verify db.ts behavior for single().
          // "single() { ... if (this.data && this.data.length > 0) return { data: this.data[0], error: null }; return { data: null, error: ... } }"
          // So it works like maybeSingle/single combined.

        if (catData) {
          categoryId = catData.id;
        } else {
          // If not found by exact name, try finding a similar one (e.g. for Construction)
          const { data: fuzzyCat } = await db
            .collection('service_categories')
            .select('id')
            .or(`name.ilike.%${service.name}%,name.ilike.%Construction%`)
            .limit(1)
            .single();
            
          categoryId = fuzzyCat?.id || '00000000-0000-0000-0000-000000000000';
        }
      }

      const bookingData = {
        customer_id: user.id,
        category_id: categoryId,
        address,
        description: description || selectedItem?.name || service?.description,
        status: 'matched' as const, // Initially matched, will move to payment later
        base_price: priceDetails.base,
        platform_fee: priceDetails.fee,
        worker_earning: priceDetails.workerShare,
        total_price: priceDetails.total,
        is_instant: bookingType === 'instant',
        is_emergency: bookingType === 'emergency',
        scheduled_at: bookingType === 'scheduled' ? `${scheduledDate}T${scheduledTime}:00` : new Date().toISOString(),
        city: profile?.city || 'Unspecified',
        latitude: selectedLocation?.lat,
        longitude: selectedLocation?.lng,
        otp_start: Math.floor(1000 + Math.random() * 9000).toString() // Generate 4-digit OTP
      };

      const { data: booking, error: bookingError } = await db
        .collection('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      const bookingId = booking.id;
      setNewBookingId(bookingId);
      
      // Navigate to tracking page with OTP state
      navigate(`/tracking/${bookingId}`, { state: { showOtp: true, amount: priceDetails.total } });
      
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(language === 'hi' ? 'बुकिंग में त्रुटि' : `Booking failed: ${error.message}`);
    }
  };

  if (!service) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-slate-500 mb-8 max-w-xs">The service you're looking for doesn't exist or is currently unavailable.</p>
          <Button onClick={() => navigate('/services')} className="rounded-full px-8">Browse All Services</Button>
        </div>
      </Layout>
    );
  }

  const steps = hasSubItems ? [
    { titleEn: 'Service', titleHi: 'सेवा' },
    { titleEn: 'Type', titleHi: 'प्रकार' },
    { titleEn: 'Details', titleHi: 'विवरण' },
    { titleEn: 'Confirm', titleHi: 'पुष्टि' }
  ] : [
    { titleEn: 'Type', titleHi: 'प्रकार' },
    { titleEn: 'Details', titleHi: 'विवरण' },
    { titleEn: 'Confirm', titleHi: 'पुष्टि' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        <div className="container max-w-2xl px-4 py-8">
          
          {/* Step Indicator Header */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
            <div className="flex items-center justify-between mb-8">
              <Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="font-bold text-lg">{selectedItem ? selectedItem.name : service.localizedName}</h1>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                   {language === 'hi' ? `चरण ${step}` : `Step ${step}`} OF {totalSteps}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${service.color}15` }}>
                <Icon className="h-6 w-6" style={{ color: service.color }} />
              </div>
            </div>

            <div className="flex justify-between relative px-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
              
              {steps.map((s, i) => {
                const isCompleted = i + 1 < step;
                const isActive = i + 1 === step;
                return (
                  <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                      isCompleted ? "bg-primary border-primary text-white" : 
                      isActive ? "bg-white border-primary text-primary shadow-lg shadow-primary/20 scale-110" : 
                      "bg-white border-slate-200 text-slate-400"
                    )}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <span className={cn(
                      "text-[10px] mt-2 font-bold uppercase tracking-wider",
                      isActive ? "text-primary" : "text-slate-400"
                    )}>
                      {language === 'hi' ? s.titleHi : s.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Subcategory Selection (Only if hasSubItems) */}
            {hasSubItems && step === 1 && (
              <motion.div
                key="subcategory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800">
                    {language === 'hi' ? 'विशिष्ट सेवा चुनें' : 'Select Specific Service'}
                  </h2>
                  <p className="text-slate-500">Pick exactly what you need help with.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {detailedItems?.map((item) => (
                    <Card
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setStep(2);
                      }}
                      className={cn(
                        "group cursor-pointer border-2 transition-all duration-300 rounded-3xl overflow-hidden hover:shadow-lg",
                        selectedItem?.id === item.id ? "border-primary bg-primary/5 shadow-primary/10" : "border-slate-100"
                      )}
                    >
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <Sparkles className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-sm text-slate-500">Starts at ₹{item.price}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1/2: Booking Type Selection */}
            {((!hasSubItems && step === 1) || (hasSubItems && step === 2)) && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800">
                    {language === 'hi' ? 'कैसे बुक करना चाहते हैं?' : 'How do you want to book?'}
                  </h2>
                  <p className="text-slate-500">Choose the timing that works best for you.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'instant', icon: Zap, label: 'Instant Service', desc: 'Worker arrives in 45-60 min', color: 'blue' },
                    { id: 'scheduled', icon: Calendar, label: 'Schedule Visit', desc: 'Pick a date and time slot', color: 'emerald' },
                    { id: 'emergency', icon: AlertTriangle, label: 'Emergency', desc: 'Varies by availability, 2x price', color: 'rose' }
                  ].map((type) => (
                    <Card
                      key={type.id}
                      onClick={() => setBookingType(type.id as BookingType)}
                      className={cn(
                        "group cursor-pointer border-2 transition-all duration-300 rounded-[2rem] overflow-hidden",
                        bookingType === type.id ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-slate-100 hover:border-slate-300"
                      )}
                    >
                      <CardContent className="p-6 flex items-center gap-5">
                        <div className={cn(
                          "h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
                          bookingType === type.id ? "bg-primary text-white" : "bg-slate-50 text-slate-400"
                        )}>
                          <type.icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className={cn("font-bold text-lg", bookingType === type.id ? "text-primary" : "text-slate-700")}>
                            {type.label}
                          </h3>
                          <p className="text-sm text-slate-500">{type.desc}</p>
                        </div>
                        <div className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                          bookingType === type.id ? "border-primary bg-primary" : "border-slate-200"
                        )}>
                          {bookingType === type.id && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {bookingType === 'scheduled' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white rounded-3xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-600">Select Date</Label>
                        <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-600">Select Time</Label>
                        <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="rounded-xl h-12" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button onClick={() => setStep(step + 1)} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/30 mt-4">
                  Continue to Address
                </Button>
              </motion.div>
            )}

            {/* Step 2/3: Address Selection */}
            {((!hasSubItems && step === 2) || (hasSubItems && step === 3)) && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800">
                    {language === 'hi' ? 'कहाँ आना है?' : 'Where should we come?'}
                  </h2>
                  <p className="text-slate-500">Provide your location and any specific details.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-bold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Service Address
                    </Label>
                    <div className="relative">
                      <Textarea
                        placeholder="House no, Building, Street Name..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="rounded-3xl min-h-[120px] p-5 bg-white border-slate-200 focus:ring-primary focus:border-primary"
                      />
                      <Button 
                        variant="link" 
                        onClick={() => setShowMapPicker(true)}
                        className="absolute bottom-4 right-4 text-primary font-bold flex items-center gap-2 hover:no-underline"
                      >
                         <Navigation className="h-4 w-4" /> Pick from Map
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700 font-bold flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Instructions (Optional)
                    </Label>
                    <Input
                      placeholder="e.g. Broken knob, water leakage..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-xl h-14 bg-white border-slate-200"
                    />
                  </div>
                </div>

                <Button onClick={() => setStep(3)} disabled={!address} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/30 mt-4">
                  Review & Book
                </Button>
              </motion.div>
            )}

            {step === 3 && !searching && !workerFound && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Review Booking</h2>
                  <p className="text-slate-500">Transparent pricing, no hidden charges.</p>
                </div>

                <div className="grid gap-4">
                  <Card className="rounded-[2rem] border-slate-100 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${service.color}15` }}>
                          <Icon className="h-7 w-7" style={{ color: service.color }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{service.localizedName}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] uppercase">{bookingType}</Badge>
                            <span className="text-xs text-slate-400 font-medium">Verified Prof.</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-primary mt-1" />
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{address}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                          <Clock className="h-4 w-4 text-primary" />
                          {bookingType === 'instant' ? 'Arriving today in 60 min' : `${scheduledDate} at ${scheduledTime}`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-primary/20 bg-gradient-to-br from-white to-primary/5">
                    <CardContent className="p-6">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-primary" /> Price Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Base Service Fee</span>
                          <span className="font-bold">₹{priceDetails.base}</span>
                        </div>
                        <div className="flex justify-between text-sm text-emerald-600">
                          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Worker Earning</span>
                          <span className="font-bold">₹{priceDetails.workerShare}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>Safety & Insurance</span>
                          <span className="font-bold">₹{priceDetails.fee}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between">
                          <span className="font-bold text-slate-800">Total Amount</span>
                          <span className="text-2xl font-black text-primary">₹{priceDetails.total}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button onClick={handleBooking} className="w-full h-16 rounded-[2rem] text-xl font-black shadow-xl shadow-primary/30 mt-4 group">
                  <Zap className="mr-2 h-6 w-6 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                  CONFIRM & BOOK
                </Button>
              </motion.div>
            )}

            {searching && (
              <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center">
                 <div className="relative mb-12">
                   <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping h-32 w-32" />
                   <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping h-32 w-32 delay-700" />
                   <div className="relative z-10 h-32 w-32 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-primary">
                     <Icon className="h-16 w-16 text-primary" />
                   </div>
                 </div>
                 <h2 className="text-2xl font-black text-slate-800 mb-2">Finding Your Professional</h2>
                 <p className="text-slate-500 font-medium">Scanning 14 available workers nearby...</p>
                 <div className="mt-8 flex gap-2">
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                   ))}
                 </div>
              </motion.div>
            )}

            {workerFound && (
              <motion.div key="found" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="text-center py-8">
                  <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Check className="h-12 w-12 stroke-[4]" />
                  </div>
                  <h2 className="text-3xl font-black text-emerald-600">Professional Found!</h2>
                  <p className="text-slate-500 mt-2">Success! We've matched you with an expert.</p>
                </div>

                <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-3xl font-black text-primary shadow-inner border border-slate-100">
                        RK
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-2xl font-extrabold text-slate-800">Ramesh Kumar</h3>
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100"><Shield className="h-3 w-3 mr-1" /> Vetted</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 font-bold mb-4">
                           <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9</span>
                           <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> 8y Exp</span>
                        </div>
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline" className="rounded-full font-bold border-slate-200"><Phone className="h-4 w-4 mr-2" /> Call</Button>
                          <Button size="sm" variant="outline" className="rounded-full font-bold border-slate-200"><MessageSquare className="h-4 w-4 mr-2" /> Chat</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-slate-50 rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none">Estimated Arrival</p>
                          <p className="text-lg font-black text-slate-800">32 Minutes</p>
                        </div>
                      </div>
                      <Button onClick={confirmBookingAndNavigate} className="rounded-2xl px-8 font-bold">Track Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={showMapPicker} onOpenChange={setShowMapPicker}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-[2rem]">
          <div className="h-[500px] relative">
            <LocationPicker 
               onConfirm={(loc) => {
                 setAddress(loc.address);
                 setShowMapPicker(false);
                 toast.success("Location updated!");
               }}
               onCancel={() => setShowMapPicker(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
