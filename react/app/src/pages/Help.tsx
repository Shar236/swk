import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Phone, Mail, MessageCircle, HelpCircle, FileText, 
  Shield, Users, Clock, Star, ChevronRight, Search,
  Headphones, BookOpen, AlertCircle, Send, Plus, Minus
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const faqData = [
  {
    q: 'How do I book a service?',
    qHi: 'मैं सेवा कैसे बुक करूं?',
    a: 'Browse our services, select the one you need, choose a time slot, and confirm your booking. A worker will be assigned in 60 seconds.',
    aHi: 'हमारी सेवाओं को ब्राउज़ करें, जो आपको चाहिए वह चुनें, समय स्लॉट चुनें और अपनी बुकिंग की पुष्टि करें। 60 सेकंड में एक कर्मचारी नियुक्त किया जाएगा।'
  },
  {
    q: 'What is the commission rate?',
    qHi: 'कमीशन दर क्या है?',
    a: 'We believe in fairness. RAHI only takes 8-12% commission, while competitors take 30-40%. This ensures workers earn more.',
    aHi: 'हम न्याय में विश्वास करते हैं। RAHI केवल 8-12% कमीशन लेता है, जबकि प्रतियोगी 30-40% लेते हैं।'
  }
];

export default function Help() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaq = useMemo(() => {
    return faqData.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.qHi.includes(searchQuery)
    );
  }, [searchQuery]);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        {/* Header Hero */}
        <div className="bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="container px-4 py-20 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
                <Headphones className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">Hello! How can we help?</h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">We're here to support you 24/7. Find answers to common questions or reach out directly.</p>
              
              <div className="max-w-xl mx-auto relative group">
                <div className="absolute -inset-1 bg-primary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-2 flex items-center border border-slate-100 shadow-2xl">
                  <Search className="h-6 w-6 text-slate-400 ml-4 mr-3" />
                  <Input 
                    placeholder="Search for answers (e.g. tracking, payment)..." 
                    className="border-none shadow-none focus-visible:ring-0 text-slate-900 h-12 text-lg px-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container px-4 py-12">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 -mt-24 relative z-20">
            {[
              { title: 'Call Center', val: '1800-RAHI-HELP', icon: Phone, color: 'text-blue-600', bg: 'bg-white' },
              { title: 'WhatsApp', val: '+91 9876543210', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-white' },
              { title: 'Email Us', val: 'support@rahi.app', icon: Mail, color: 'text-rose-600', bg: 'bg-white' },
              { title: 'Video Guide', val: 'Watch Tutorials', icon: PlayCircleIcon, color: 'text-amber-600', bg: 'bg-white' },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toast.info(`Connecting to ${c.title}...`)}
                className="cursor-pointer"
              >
                <Card className="rounded-[2rem] border-slate-100 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden h-full group">
                  <CardContent className="p-8 text-center flex flex-col items-center">
                    <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-slate-50")}>
                      <c.icon className={cn("h-8 w-8", c.color)} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">{c.title}</h3>
                    <p className="text-sm font-bold text-primary">{c.val}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* FAQ Area */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" /> Popular Questions
                </h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaq.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border rounded-[1.5rem] bg-white px-6 overflow-hidden transition-all duration-300 data-[state=open]:shadow-xl data-[state=open]:border-primary/20">
                      <AccordionTrigger className="hover:no-underline py-6">
                        <span className="text-left font-bold text-lg text-slate-800 group">
                          {language === 'hi' ? faq.qHi : faq.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-slate-500 leading-relaxed text-base">
                        {language === 'hi' ? faq.aHi : faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {filteredFaq.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No results found</h3>
                    <p className="text-slate-500">Try using different keywords or scroll up to contact us.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form Area */}
            <div>
              <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200 overflow-hidden sticky top-24">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Message Us</h3>
                  <p className="text-sm text-slate-500 mb-8 font-medium">Can't find what you need? Send a quick message to our team.</p>
                  
                  <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Message sent! We'll reply shortly.");
                  }}>
                    <div className="space-y-2">
                       <Input placeholder="Full Name" className="rounded-xl h-14 bg-slate-50 border-slate-100" required />
                    </div>
                    <div className="space-y-2">
                       <Input placeholder="Email Address" type="email" className="rounded-xl h-14 bg-slate-50 border-slate-100" required />
                    </div>
                    <div className="space-y-2">
                       <Textarea placeholder="How can we help you today?" className="rounded-xl min-h-[120px] bg-slate-50 border-slate-100 p-4" required />
                    </div>
                    <Button type="submit" className="w-full h-16 rounded-[1.5rem] text-lg font-black shadow-lg shadow-primary/20 group">
                       Send Message <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Add simple PlayCircle replacement if missing
function PlayCircleIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}
