import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Clock, Calendar, Zap, AlertTriangle, 
  ChevronRight, Check, Loader2, Shield, Star, IndianRupee,
  User, Phone, MessageSquare, CreditCard, Wallet, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

type BookingType = 'instant' | 'scheduled' | 'emergency';

export default function EnhancedBookService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState<BookingType>('instant');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceDetails = {
    id: serviceId || 'ac-repair',
    name: 'AC Repair',
    nameHi: 'एसी रिपेयर',
    price: 299,
    duration: '45-60 min',
    rating: 4.8,
    pros: 1247
  };

  const bookingTypes = [
    {
      type: 'instant' as BookingType,
      title: language === 'hi' ? 'तुरंत बुकिंग' : 'Instant Booking',
      titleHi: 'तुरंत बुकिंग',
      description: language === 'hi' ? 'अभी उपलब्ध पेशेवर के साथ' : 'With available professional now',
      descriptionHi: 'अभी उपलब्ध पेशेवर के साथ',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      time: language === 'hi' ? '30 मिनट में' : 'Within 30 mins'
    },
    {
      type: 'scheduled' as BookingType,
      title: language === 'hi' ? 'शेड्यूल्ड बुकिंग' : 'Scheduled Booking',
      titleHi: 'शेड्यूल्ड बुकिंग',
      description: language === 'hi' ? 'भविष्य के लिए समय चुनें' : 'Choose time for future',
      descriptionHi: 'भविष्य के लिए समय चुनें',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      time: language === 'hi' ? 'अपनी सुविधानुसार' : 'At your convenience'
    },
    {
      type: 'emergency' as BookingType,
      title: language === 'hi' ? 'आपातकालीन सेवा' : 'Emergency Service',
      titleHi: 'आपातकालीन सेवा',
      description: language === 'hi' ? 'तत्काल सहायता की आवश्यकता है' : 'For urgent assistance',
      descriptionHi: 'तत्काल सहायता की आवश्यकता है',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      time: language === 'hi' ? '15 मिनट में' : 'Within 15 mins',
      premium: true
    }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(language === 'hi' ? 'बुकिंग सफल!' : 'Booking successful!');
      navigate('/tracking/12345');
    } catch (error) {
      toast.error(language === 'hi' ? 'बुकिंग विफल' : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {language === 'hi' ? 'बुकिंग प्रकार चुनें' : 'Choose Booking Type'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'hi' ? 'अपनी आवश्यकता के अनुसार सेवा बुक करें' : 'Book service according to your needs'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {bookingTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.type}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
              onClick={() => {
                setBookingType(type.type);
                setStep(2);
              }}
            >
              <Card className={`border-2 transition-all duration-300 ${
                bookingType === type.type 
                  ? 'border-primary shadow-lg' 
                  : 'hover:border-primary/50'
              }`}>
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${type.color} text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">
                    {language === 'hi' ? type.titleHi : type.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {language === 'hi' ? type.descriptionHi : type.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{type.time}</Badge>
                    {type.premium && (
                      <Badge variant="destructive">
                        {language === 'hi' ? '+प्रीमियम' : '+Premium'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setStep(1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'hi' ? 'वापस' : 'Back'}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'hi' ? 'विवरण दर्ज करें' : 'Enter Details'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'hi' ? 'अपना पता और आवश्यकता बताएं' : 'Provide your address and requirements'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {language === 'hi' ? 'सेवा स्थान' : 'Service Location'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={language === 'hi' ? 'अपना पूरा पता दर्ज करें' : 'Enter your full address'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" className="w-full">
                {language === 'hi' ? 'मैप से चुनें' : 'Select from Map'}
              </Button>
            </CardContent>
          </Card>

          {bookingType === 'scheduled' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {language === 'hi' ? 'शेड्यूल करें' : 'Schedule'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">
                    {language === 'hi' ? 'तारीख' : 'Date'}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="h-12 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="time">
                    {language === 'hi' ? 'समय' : 'Time'}
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-12 mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {language === 'hi' ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={language === 'hi' 
                  ? 'समस्या का विस्तृत विवरण दें...' 
                  : 'Provide detailed problem description...'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <CardHeader>
              <CardTitle>
                {language === 'hi' ? 'आदेश सारांश' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>
                  {language === 'hi' ? serviceDetails.nameHi : serviceDetails.name}
                </span>
                <span className="font-bold">₹{serviceDetails.price}</span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>
                    {language === 'hi' ? 'कुल' : 'Total'}
                  </span>
                  <span className="text-primary">₹{serviceDetails.price}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>
                    {language === 'hi' ? '100% सुरक्षित भुगतान' : '100% Secure Payment'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>
                    {language === 'hi' ? 'सत्यापित पेशेवर' : 'Verified Professional'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>
                    {serviceDetails.duration} {language === 'hi' ? 'औसत समय' : 'avg time'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-12 text-lg"
            onClick={() => setStep(3)}
            disabled={!address || (bookingType === 'scheduled' && (!scheduledDate || !scheduledTime))}
          >
            {language === 'hi' ? 'आगे बढ़ें' : 'Continue'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setStep(2)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'hi' ? 'वापस' : 'Back'}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'hi' ? 'भुगतान करें' : 'Make Payment'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'hi' ? 'सुरक्षित और सुविधाजनक भुगतान विकल्प' : 'Secure and convenient payment options'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {language === 'hi' ? 'भुगतान विधि चुनें' : 'Choose Payment Method'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { method: 'upi', name: 'UPI', icon: QrCode },
                { method: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                { method: 'wallet', name: 'Digital Wallet', icon: Wallet },
                { method: 'cod', name: 'Cash on Delivery', icon: IndianRupee }
              ].map((payment) => {
                const Icon = payment.icon;
                return (
                  <div 
                    key={payment.method}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">
                        {payment.name}
                      </span>
                    </div>
                    <Check className="h-5 w-5 text-muted-foreground" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <CardHeader>
              <CardTitle>
                {language === 'hi' ? 'अंतिम सारांश' : 'Final Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'hi' ? serviceDetails.nameHi : serviceDetails.name}
                  </span>
                  <span>₹{serviceDetails.price}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {language === 'hi' ? 'प्लेटफॉर्म शुल्क' : 'Platform Fee'}
                  </span>
                  <span>₹{(serviceDetails.price * 0.1).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {language === 'hi' ? 'जीएसटी' : 'GST'}
                  </span>
                  <span>₹{(serviceDetails.price * 0.18).toFixed(0)}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>
                    {language === 'hi' ? 'कुल योग' : 'Total Amount'}
                  </span>
                  <span className="text-primary">
                    ₹{(serviceDetails.price * 1.28).toFixed(0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-12 text-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {language === 'hi' ? 'प्रस्तुत किया जा रहा है...' : 'Processing...'}
              </>
            ) : (
              <>
                {language === 'hi' ? 'बुकिंग कन्फर्म करें' : 'Confirm Booking'}
                <Check className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 h-2 rounded-full ${
                    step > num ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {language === 'hi' ? 'सेवा बुक करें' : 'Book Service'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === 'hi' 
                ? `${serviceDetails.nameHi} के लिए बुकिंग` 
                : `Booking for ${serviceDetails.name}`
              }
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}