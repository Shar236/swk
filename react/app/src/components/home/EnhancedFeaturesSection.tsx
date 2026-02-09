import { motion } from 'framer-motion';
import { 
  Clock, Shield, IndianRupee, MapPin, Star, Users, 
  Award, Headphones, TrendingUp, HeartHandshake, Zap, Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Clock,
    titleEn: 'Lightning Fast',
    titleHi: 'तेज़ और तुरंत',
    descEn: 'Get connected with verified professionals in under 60 seconds',
    descHi: '60 सेकंड में सत्यापित पेशेवर से जुड़ें',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    badge: 'Fastest'
  },
  {
    icon: Shield,
    titleEn: '100% Verified',
    titleHi: '100% सत्यापित',
    descEn: 'All professionals are Aadhaar & PAN verified with background checks',
    descHi: 'सभी पेशेवर आधार और पैन सत्यापित हैं',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    badge: 'Trusted'
  },
  {
    icon: IndianRupee,
    titleEn: 'Fair Pricing',
    titleHi: 'न्यायसंगत मूल्य',
    descEn: 'Only 8-12% commission - maximum earnings for professionals',
    descHi: 'केवल 8-12% कमीशन - पेशेवर ज्यादा कमाएं',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    badge: 'Affordable'
  },
  {
    icon: MapPin,
    titleEn: 'Live Tracking',
    titleHi: 'लाइव ट्रैकिंग',
    descEn: 'Track your service professional in real-time on the map',
    descHi: 'मैप पर अपने सेवा पेशेवर को रियल-टाइम में ट्रैक करें',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    badge: 'Real-time'
  },
  {
    icon: Star,
    titleEn: 'Two-Way Rating',
    titleHi: 'दोतरफा रेटिंग',
    descEn: 'Professionals can rate customers too - promoting mutual respect',
    descHi: 'पेशेवर भी ग्राहकों को रेट कर सकते हैं - पारस्परिक सम्मान',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    badge: 'Fair'
  },
  {
    icon: Users,
    titleEn: 'Worker Welfare',
    titleHi: 'कारीगर कल्याण',
    descEn: '₹2 per booking goes to worker insurance & welfare fund',
    descHi: 'हर बुकिंग से ₹2 कारीगर बीमा और कल्याण कोष में',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    badge: 'Social'
  }
];

const benefits = [
  {
    icon: Award,
    titleEn: 'Quality Guarantee',
    titleHi: 'गुणवत्ता गारंटी',
    descEn: '100% satisfaction guarantee on all services',
    descHi: 'सभी सेवाओं पर 100% संतुष्टि गारंटी'
  },
  {
    icon: Headphones,
    titleEn: '24/7 Support',
    titleHi: '24/7 सहायता',
    descEn: 'Round-the-clock customer support team',
    descHi: 'पूरे दिन ग्राहक सहायता टीम'
  },
  {
    icon: TrendingUp,
    titleEn: 'Growing Network',
    titleHi: 'बढ़ता नेटवर्क',
    descEn: '50,000+ verified professionals across India',
    descHi: 'भारत भर में 50,000+ सत्यापित पेशेवर'
  },
  {
    icon: HeartHandshake,
    titleEn: 'Community First',
    titleHi: 'समुदाय प्रथम',
    descEn: 'Building better livelihoods for skilled workers',
    descHi: 'कुशल श्रमिकों के लिए बेहतर आजीविका निर्माण'
  }
];

export function EnhancedFeaturesSection() {
  const { language } = useLanguage();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-muted/20 via-background to-muted/20">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
            <Zap className="h-4 w-4 mr-2 text-amber-500" />
            {language === 'hi' ? 'क्यों RAHI?' : 'Why RAHI?'}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'hi' ? 'हम क्यों अलग हैं' : 'What Makes Us Different'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'भारत का सबसे विश्वसनीय और न्यायसंगत सर्विस प्लेटफॉर्म - पेशेवर और ग्राहक दोनों के लिए'
              : "India's most trusted and fair service platform - for both professionals and customers"
            }
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card className="h-full border-2 hover:border-primary/30 transition-all duration-300 group bg-gradient-to-br from-card to-muted/20 overflow-hidden">
                <CardContent className="p-8">
                  {/* Badge */}
                  <Badge 
                    variant="outline" 
                    className="mb-4 text-xs px-3 py-1"
                  >
                    {feature.badge}
                  </Badge>
                  
                  {/* Icon */}
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 ${feature.bg}`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {language === 'hi' ? feature.titleHi : feature.titleEn}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'hi' ? feature.descHi : feature.descEn}
                  </p>
                  
                  {/* Decorative Element */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>
                        {language === 'hi' ? 'भारत भर में उपलब्ध' : 'Available Across India'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div 
          className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12 border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              {language === 'hi' ? 'अतिरिक्त लाभ' : 'Additional Benefits'}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'हमारे प्लेटफॉर्म के साथ आपको मिलते हैं ये विशेष फायदे'
                : 'These special benefits come with our platform'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {language === 'hi' ? benefit.titleHi : benefit.titleEn}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? benefit.descHi : benefit.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: '50K+', label: language === 'hi' ? 'सत्यापित पेशेवर' : 'Verified Pros' },
            { value: '2L+', label: language === 'hi' ? 'सफल बुकिंग' : 'Successful Bookings' },
            { value: '4.8★', label: language === 'hi' ? 'औसत रेटिंग' : 'Avg Rating' },
            { value: '200+', label: language === 'hi' ? 'शहरों में' : 'Cities Covered' }
          ].map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}