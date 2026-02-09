import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Star, Shield, Clock, Info, 
  ChevronRight, CheckCircle2, Zap, Hammer 
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AC_SERVICE_CATEGORIES, ServiceItem } from '@/data/services/acServices';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ACServicePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(AC_SERVICE_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = AC_SERVICE_CATEGORIES
    .find(cat => cat.id === activeCategory)?.items
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-16 z-20">
          <div className="container px-4 py-8">
            <Button variant="ghost" onClick={() => navigate('/services')} className="mb-4 -ml-2 text-slate-500 hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Services
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">AC Repair & Service</h1>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    4.9 (12.4k reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-primary" />
                    Verified Experts
                  </span>
                </div>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search parts or services..." 
                  className="pl-10 h-11 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="container px-4 border-t">
            <div className="flex overflow-x-auto no-scrollbar py-2">
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="bg-transparent h-auto p-0 gap-8">
                  {AC_SERVICE_CATEGORIES.map(cat => (
                    <TabsTrigger 
                      key={cat.id} 
                      value={cat.id}
                      className="px-0 py-4 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-bold text-slate-500 transition-all"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Service List */}
            <div className="lg:col-span-2 space-y-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Card key={item.id} className="border-slate-100 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                            {item.category}
                          </span>
                          {item.acType && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
                              {item.acType} AC
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-6">
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Part Charge</p>
                              <p className="font-black text-slate-900">₹{item.serviceCharge}</p>
                           </div>
                           <div className="text-slate-200 text-2xl font-light">|</div>
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Labor</p>
                              <p className="font-black text-slate-900">₹{item.laborCharge}</p>
                           </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 flex flex-col justify-between items-center sm:items-end sm:min-w-[160px] border-t sm:border-t-0 sm:border-l border-slate-100">
                        <div className="text-center sm:text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total</p>
                          <p className="text-2xl font-black text-primary">₹{item.totalCharge}</p>
                        </div>
                        <Button 
                          onClick={() => navigate(`/book/ac-repair?item=${item.id}`)}
                          className="w-full mt-4 rounded-xl font-black h-12 shadow-lg shadow-primary/20"
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                   <p className="text-slate-500">No items found matching your search.</p>
                </div>
              )}
            </div>

            {/* Sidebar / Info */}
            <div className="space-y-8">
               <Card className="bg-slate-900 text-white rounded-[2rem] overflow-hidden border-none shadow-2xl">
                  <CardContent className="p-8">
                     <h4 className="text-2xl font-black mb-6">Why RAHI AC Care?</h4>
                     <div className="space-y-6">
                        {[
                          { title: "Fixed Price", desc: "No hidden charges on parts or labor.", icon: Zap },
                          { title: "Authentic Parts", desc: "Genuine company parts with warranty.", icon: Shield },
                          { title: "Background Verified", desc: "Professionals checked by local police.", icon: CheckCircle2 }
                        ].map((feat, i) => (
                          <div key={i} className="flex gap-4">
                             <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <feat.icon className="h-5 w-5 text-primary" />
                             </div>
                             <div>
                                <p className="font-bold mb-1">{feat.title}</p>
                                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                  <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Important Note
                  </h4>
                  <ul className="space-y-3 text-sm font-medium text-slate-600">
                    <li className="flex gap-2">
                       <span className="text-primary">•</span>
                       Visiting charges of ₹299 applicable if no service is opted.
                    </li>
                    <li className="flex gap-2">
                       <span className="text-primary">•</span>
                       Warranty available for 30 days on labor.
                    </li>
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}