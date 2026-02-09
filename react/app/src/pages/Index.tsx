import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { EnhancedHeroSection } from '@/components/home/EnhancedHeroSection';
import { EnhancedServiceGrid } from '@/components/home/EnhancedServiceGrid';
import { EnhancedFeaturesSection } from '@/components/home/EnhancedFeaturesSection';
import { EnhancedHowItWorks } from '@/components/home/EnhancedHowItWorks';
import { RoleSelection } from '@/components/home/RoleSelection';
import { DownloadApp } from '@/components/home/DownloadApp';
import { LoginCard } from '@/components/auth/LoginCard';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Shield, Users, Briefcase } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { user } = useAuth();
  const { subscribeToUserBookings } = useNotifications();
  const { language } = useLanguage();

  // Subscribe to user's bookings when logged in
  useEffect(() => {
    if (user) {
      subscribeToUserBookings();
    }
  }, [user, subscribeToUserBookings]);

  return (
    <Layout>
      <EnhancedHeroSection />
      <EnhancedServiceGrid />
      <EnhancedHowItWorks />
      
      {/* Customer Zone - Premium Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                <Users className="h-4 w-4" />
                Customer Zone
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Quality Services at your <span className="text-primary italic">Doorstep.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed">
                Connect with background-verified professionals who care as much about your home as you do. RAHI brings trust, quality, and fair pricing back to home services.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "100% Verified", desc: "Aadhar & Police verified" },
                  { icon: Star, title: "Top Rated", desc: "Average 4.9/5 stars" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
            >
              <img src="/images/customer_zone_hero.png" alt="Happy Family" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Login & Get Started Section */}
      {!user && (
        <section className="py-24 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
          
          <div className="container px-4 relative z-10">
            <div className="text-center mb-16 space-y-4">
               <h2 className="text-4xl md:text-6xl font-black text-slate-900">Ready to <span className="text-primary">Experience</span> the Difference?</h2>
               <p className="text-xl text-slate-500 max-w-2xl mx-auto">Join the RAHI family today. Quick login to book your first service in less than a minute.</p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
               <div className="w-full lg:w-1/2 max-w-md">
                 <LoginCard />
               </div>
               <div className="w-full lg:w-1/2 space-y-10">
                  <div className="space-y-8">
                     {[
                       { title: "No Subscription Fees", desc: "Pay only for the services you use, with zero hidden costs or memberships." },
                       { title: "Direct Worker Contact", desc: "Message your professional directly once a job is confirmed for crystal clear communication." },
                       { title: "Real-time Tracking", desc: "Watch your professional arrive on a live map within the RAHI app." }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-6">
                         <div className="h-12 w-12 rounded-2xl bg-slate-900 flex-shrink-0 flex items-center justify-center text-white shadow-xl">
                            <CheckCircle2 className="h-6 w-6" />
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-slate-500 font-medium">{item.desc}</p>
                         </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Worker Zone - Empowerment Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10 order-2 lg:order-1"
            >
              <img src="/images/worker_zone_hero.png" alt="Empowered Worker" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm">
                <Briefcase className="h-4 w-4" />
                Worker Zone
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Be Your Own <span className="text-primary">Boss.</span> Earn More.
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                We believe in ethical growth. Workers keep 90% of their earnings. No daily penalties, no forced shifts, just pure professional respect.
              </p>
              <div className="space-y-4">
                {[
                  "Same-day payments directly to your bank",
                  "Full control over your working hours",
                  "No hidden algorithm penalties",
                  "Accident insurance coverage for all partners"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-lg font-bold">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <RoleSelection />
            </motion.div>
          </div>
        </div>
      </section>

      <EnhancedFeaturesSection />
      <DownloadApp />
    </Layout>
  );
};

export default Index;
