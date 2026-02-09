import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Shield, Clock, MapPin, Phone, MessageCircle,
  ThumbsUp, Award, TrendingUp, CheckCircle, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const mockWorkers = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    service: 'AC Repair',
    serviceHi: 'एसी रिपेयर',
    rating: 4.9,
    jobs: 127,
    experience: '8 years',
    location: 'Delhi, Sector 15',
    verified: true,
    price: '₹350/hr',
    languages: ['Hindi', 'English'],
    specialties: ['Split AC', 'Window AC', 'Commercial AC']
  },
  {
    id: '2',
    name: 'Suresh Patel',
    service: 'Plumbing',
    serviceHi: 'प्लंबिंग',
    rating: 4.8,
    jobs: 89,
    experience: '6 years',
    location: 'Delhi, Sector 22',
    verified: true,
    price: '₹280/hr',
    languages: ['Gujarati', 'Hindi'],
    specialties: ['Leak Repair', 'Installation', 'Drain Cleaning']
  },
  {
    id: '3',
    name: 'Mahesh Singh',
    service: 'Electrician',
    serviceHi: 'इलेक्ट्रीशियन',
    rating: 4.7,
    jobs: 156,
    experience: '10 years',
    location: 'Delhi, Sector 18',
    verified: true,
    price: '₹320/hr',
    languages: ['Hindi', 'Punjabi'],
    specialties: ['Wiring', 'Fixture Installation', 'Fault Finding']
  }
];

export default function EnhancedWorkerShowcase() {
  const { language } = useLanguage();
  const [selectedWorker, setSelectedWorker] = useState<typeof mockWorkers[0] | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'hi' ? 'हमारे विशेषज्ञ' : 'Our Experts'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'भारत के सर्वश्रेष्ठ सत्यापित पेशेवर - आपकी सेवा की गारंटी'
              : 'India\'s finest verified professionals - guaranteed service quality'
            }
          </p>
        </motion.div>

        {/* Worker Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockWorkers.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card 
                className="h-full overflow-hidden cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 group"
                onClick={() => setSelectedWorker(worker)}
              >
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  {worker.verified && (
                    <Badge className="absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {language === 'hi' ? 'सत्यापित' : 'Verified'}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {worker.name}
                    </h3>
                    <p className="text-primary font-semibold">
                      {language === 'hi' ? worker.serviceHi : worker.service}
                    </p>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{worker.rating}</span>
                      <span className="text-muted-foreground text-sm">({worker.jobs} jobs)</span>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  <div className="text-center mb-4">
                    <Badge variant="secondary" className="text-sm">
                      {worker.experience} {language === 'hi' ? 'अनुभव' : 'experience'}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <p className="text-2xl font-bold text-primary">{worker.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'प्रति घंटा' : 'per hour'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      {language === 'hi' ? 'कॉल करें' : 'Call'}
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {language === 'hi' ? 'संदेश' : 'Message'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        <motion.div 
          className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {language === 'hi' ? 'क्यों हमारे पेशेवर चुनें?' : 'Why Choose Our Professionals?'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: language === 'hi' ? '100% सत्यापित' : '100% Verified',
                desc: language === 'hi' ? 'आधार और पैन कार्ड सत्यापित' : 'Aadhaar and PAN verified'
              },
              {
                icon: Award,
                title: language === 'hi' ? 'विशेषज्ञता' : 'Expertise',
                desc: language === 'hi' ? 'विशेष तकनीकी कौशल' : 'Specialized technical skills'
              },
              {
                icon: TrendingUp,
                title: language === 'hi' ? 'उच्च रेटिंग' : 'High Ratings',
                desc: language === 'hi' ? '4.5+ औसत रेटिंग' : '4.5+ average rating'
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedWorker.name}</CardTitle>
                  <p className="text-primary font-semibold mt-1">
                    {language === 'hi' ? selectedWorker.serviceHi : selectedWorker.service}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedWorker(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3">
                    {language === 'hi' ? 'विशेषज्ञता' : 'Specialties'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorker.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">
                    {language === 'hi' ? 'भाषाएं' : 'Languages'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorker.languages.map((lang, idx) => (
                      <Badge key={idx} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  {language === 'hi' ? 'बुक करें' : 'Book Now'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {language === 'hi' ? 'संदेश करें' : 'Send Message'}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        </div>
      )}
    </div>
  );
}