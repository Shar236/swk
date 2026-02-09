import { motion } from 'framer-motion';
import { 
  UserCheck, CalendarClock, MapPin, CreditCard, 
  ThumbsUp, Shield, Clock, Smartphone 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const steps = [
  {
    step: 1,
    titleEn: 'Choose Service',
    titleHi: 'सेवा चुनें',
    descriptionEn: 'Browse our wide range of professional services and select what you need',
    descriptionHi: 'हमारी विस्तृत पेशेवर सेवाओं की रेंज ब्राउज़ करें और चुनें जो आपको चाहिए',
    icon: UserCheck,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    step: 2,
    titleEn: 'Book Instantly',
    titleHi: 'तुरंत बुक करें',
    descriptionEn: 'Select date & time, enter your location, and confirm your booking in seconds',
    descriptionHi: 'तारीख और समय चुनें, अपना स्थान दर्ज करें, और सेकंडों में अपनी बुकिंग की पुष्टि करें',
    icon: CalendarClock,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    step: 3,
    titleEn: 'Track Progress',
    titleHi: 'प्रगति ट्रैक करें',
    descriptionEn: 'Real-time tracking of your service professional on the map',
    descriptionHi: 'मैप पर अपने सेवा पेशेवर की रीयल-टाइम ट्रैकिंग',
    icon: MapPin,
    color: 'from-purple-500 to-fuchsia-500'
  },
  {
    step: 4,
    titleEn: 'Pay Securely',
    titleHi: 'सुरक्षित भुगतान',
    descriptionEn: 'Multiple payment options with 100% secure transactions',
    descriptionHi: '100% सुरक्षित लेनदेन के साथ कई भुगतान विकल्प',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-500'
  },
  {
    step: 5,
    titleEn: 'Rate & Review',
    titleHi: 'रेट और समीक्षा',
    descriptionEn: 'Share your experience and help improve our service quality',
    descriptionHi: 'अपना अनुभव साझा करें और हमारी सेवा गुणवत्ता में सुधार में मदद करें',
    icon: ThumbsUp,
    color: 'from-rose-500 to-pink-500'
  }
];

export function EnhancedHowItWorks() {
  const { language } = useLanguage();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Smartphone className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'hi' ? 'बस 5 चरणों में सेवा प्राप्त करें' : 'Get Service in Just 5 Steps'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'हमारा सरल और सुविधाजनक प्रक्रिया आपको घर बैठे पेशेवर सेवाएं प्रदान करती है'
              : 'Our simple and convenient process delivers professional services right to your doorstep'
            }
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 to-primary/50 transform -translate-x-1/2"></div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = step.icon;
              
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={cn(
                    "relative",
                    "md:col-start-1 md:row-start-1" // For even steps
                  )}
                  style={{ 
                    gridColumn: isEven ? '1' : '2',
                    gridRow: `${Math.floor(index/2) + 1}`
                  }}
                >
                  {/* Step Number Badge */}
                  <motion.div 
                    className="absolute top-0 z-10 flex items-center justify-center"
                    style={{ 
                      left: isEven ? 'auto' : '-1rem',
                      right: isEven ? '-1rem' : 'auto'
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg",
                      `bg-gradient-to-r ${step.color}`
                    )}>
                      {step.step}
                    </div>
                    {/* Connector Dot */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary"></div>
                  </motion.div>

                  {/* Step Card */}
                  <Card className="ml-8 mr-8 md:ml-12 md:mr-12 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    <CardContent className="p-8 relative">
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className={cn(
                          "flex-shrink-0 p-4 rounded-2xl",
                          `bg-gradient-to-r ${step.color} text-white`
                        )}>
                          <Icon className="h-8 w-8" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {language === 'hi' ? step.titleHi : step.titleEn}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {language === 'hi' ? step.descriptionHi : step.descriptionEn}
                          </p>
                          
                          {/* Quick Stats */}
                          {index === 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                                <Shield className="h-3 w-3" />
                                Verified Pros
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3" />
                                60s Booking
                              </span>
                            </div>
                          )}
                          
                          {index === 1 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                <MapPin className="h-3 w-3" />
                                Live Tracking
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                <CreditCard className="h-3 w-3" />
                                Secure Pay
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-2 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold mb-3">
                {language === 'hi' ? 'तैयार हैं शुरू करने के लिए?' : 'Ready to Get Started?'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'hi' 
                  ? 'अपनी पहली सेवा बुक करें और 20% तक की छूट पाएं'
                  : 'Book your first service and get up to 20% off'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8">
                  {language === 'hi' ? 'सेवा बुक करें' : 'Book a Service'}
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  {language === 'hi' ? 'ऐप डाउनलोड करें' : 'Download App'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}