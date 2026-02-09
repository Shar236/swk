import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Briefcase, Users, Shield, CheckCircle2, 
  ChevronRight, Sparkles, MapPin, IndianRupee, FileText,
  Upload, Smartphone, Star, Lock, User, IdCard
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FormData = {
  business: {
    name: string;
    gst: string;
    address: string;
    city: string;
    pincode: string;
    yearEstablished: string;
  };
  documentation: {
    license: File | null;
    pan: File | null;
    gstCert: File | null;
  };
  preferences: {
    radius: string;
    initialTeamSize: string;
    commissionRate: string;
    about: string;
  };
  terms: boolean;
};

const ThekedarOnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    business: {
      name: '',
      gst: '',
      address: '',
      city: profile?.city || '',
      pincode: profile?.pincode || '',
      yearEstablished: ''
    },
    documentation: {
      license: null,
      pan: null,
      gstCert: null
    },
    preferences: {
      radius: '15',
      initialTeamSize: '5',
      commissionRate: '10',
      about: ''
    },
    terms: false
  });

  const totalSteps = 4;

  const handleInputChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => {
      if (section === 'terms') return { ...prev, terms: value };
      const currentSection = prev[section] as any;
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      // 1. Update Profile Role
      await supabase
        .from('profiles')
        .update({ role: 'thekedar' })
        .eq('id', user.id);

      // 2. Create Thekedar Profile
      const { error: profileError } = await (supabase as any)
        .from('thekedar_profiles')
        .upsert({
          user_id: user.id,
          business_name: formData.business.name,
          gst_number: formData.business.gst,
          business_address: formData.business.address,
          business_city: formData.business.city,
          business_pincode: formData.business.pincode,
          established_year: parseInt(formData.business.yearEstablished) || 2024,
          about_business: formData.preferences.about,
          service_radius_km: parseInt(formData.preferences.radius) || 15,
          commission_rate: parseFloat(formData.preferences.commissionRate) / 100 || 0.1,
          team_size: parseInt(formData.preferences.initialTeamSize) || 0
        });

      if (profileError) throw profileError;

      toast.success('Registration successful! Welcome to RAHI Partners.');
      
      setTimeout(() => {
        window.location.href = '/thekedar/dashboard';
      }, 1500);

    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('Failed to save profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const stepDetails = [
    { title: 'Business', icon: Building2, color: 'text-emerald-500' },
    { title: 'Verification', icon: Shield, color: 'text-teal-500' },
    { title: 'Preferences', icon: Star, color: 'text-emerald-600' },
    { title: 'Launch', icon: Sparkles, color: 'text-teal-600' },
  ];

  return (
    <Layout hideBottomNav>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-white to-teal-50 pb-20 pt-10">
        <div className="container max-w-4xl px-4">
          
          <div className="mb-12 text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-6 shadow-sm shadow-emerald-200"
            >
              <Building2 className="h-4 w-4" />
              <span>Partner Onboarding | {stepDetails[step-1].title}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Scale Your <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Business with RAHI</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              Join our network of elite Thekedars and manage projects with transparency and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="hidden lg:col-span-3 lg:flex flex-col gap-4">
              {stepDetails.map((s, i) => {
                const isActive = step === i + 1;
                const isCompleted = step > i + 1;
                return (
                  <div key={i} className={cn(
                    "relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-500",
                    isActive ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/5 scale-105 z-10" : 
                    isCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                    "bg-slate-50 border-transparent text-slate-400 opacity-60"
                  )}>
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                      isActive ? "bg-emerald-600 text-white" : 
                      isCompleted ? "bg-emerald-500 text-white" : "bg-slate-200"
                    )}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                    </div>
                    <span className="font-bold">{s.title}</span>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-9">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                <div className="h-2 w-full bg-slate-100 italic relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    className="absolute inset-y-0 bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
                
                <CardContent className="p-8 md:p-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {step === 1 && (
                        <div className="space-y-8">
                          <HeaderSection 
                            title="Business Details" 
                            subtitle="Official registration and business identity" 
                            icon={Building2}
                            color="text-emerald-600"
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                              label="Business / Enterprise Name" 
                              value={formData.business.name}
                              onChange={(v: any) => handleInputChange('business', 'name', v)}
                              placeholder="e.g. Apex Construction Group"
                            />
                            <InputField 
                              label="GST Number (Optional)" 
                              value={formData.business.gst}
                              onChange={(v: any) => handleInputChange('business', 'gst', v)}
                              placeholder="22AAAAA0000A1Z5"
                            />
                            <InputField 
                              label="City of Operation" 
                              value={formData.business.city}
                              onChange={(v: any) => handleInputChange('business', 'city', v)}
                              placeholder="e.g. Mumbai"
                            />
                            <InputField 
                              label="Established Year" 
                              value={formData.business.yearEstablished}
                              onChange={(v: any) => handleInputChange('business', 'yearEstablished', v)}
                              placeholder="e.g. 2018"
                              type="number"
                            />
                          </div>

                          <div className="space-y-4">
                            <Label className="text-lg font-bold">Business Registered Address</Label>
                            <Textarea 
                              className="rounded-2xl border-slate-100 bg-slate-50/50 p-6 min-h-[100px] text-lg"
                              value={formData.business.address}
                              onChange={(e) => handleInputChange('business', 'address', e.target.value)}
                              placeholder="Complete address with landmark..."
                            />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-8">
                          <HeaderSection 
                            title="Documentation & KYC" 
                            subtitle="Verify your licenses and identity" 
                            icon={Shield}
                            color="text-teal-600"
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <UploadCard 
                               title="Registration License" 
                               subtitle="Shop Act or Incorporation"
                               icon={FileText}
                             />
                             <UploadCard 
                               title="Business PAN" 
                               subtitle="For tax and payments"
                               icon={IdCard}
                             />
                          </div>

                          <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex gap-4">
                            <div className="h-10 w-10 shrink-0 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center">
                              <Lock className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-blue-900">Enterprise Shield</p>
                              <p className="text-sm text-blue-700">All business data is handled with bank-grade security and is used only for platform multi-verification.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-8">
                          <HeaderSection 
                            title="Operational Setup" 
                            subtitle="Define how you manage your team" 
                            icon={Users}
                            color="text-emerald-700"
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                               <Label className="text-lg font-bold">Max Service Radius (KM)</Label>
                               <div className="flex items-center gap-4">
                                 <Input 
                                   type="range" min="5" max="100" step="5"
                                   className="flex-1"
                                   value={formData.preferences.radius}
                                   onChange={(e) => handleInputChange('preferences', 'radius', e.target.value)}
                                 />
                                 <span className="h-12 w-20 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                                   {formData.preferences.radius}
                                 </span>
                               </div>
                             </div>

                             <div className="space-y-3">
                               <Label className="text-lg font-bold">Standard Commission (%)</Label>
                               <div className="relative">
                                 <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                                 <Input 
                                   className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold text-xl"
                                   value={formData.preferences.commissionRate}
                                   onChange={(e) => handleInputChange('preferences', 'commissionRate', e.target.value)}
                                 />
                               </div>
                             </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-lg font-bold">About Your Business Strategy</Label>
                            <Textarea 
                              className="rounded-2xl border-slate-100 bg-slate-50/50 p-6 min-h-[120px]"
                              value={formData.preferences.about}
                              onChange={(e) => handleInputChange('preferences', 'about', e.target.value)}
                              placeholder="Briefly describe your company's specialty (e.g. Interior finishing, Large scale electrical)..."
                            />
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-10 text-center py-6">
                           <div className="h-32 w-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow relative">
                             <CheckCircle2 className="h-16 w-16 stroke-[3]" />
                             <motion.div 
                               animate={{ scale: [1, 1.2, 1] }} 
                               transition={{ repeat: Infinity, duration: 2 }}
                               className="absolute -top-1 -right-1 h-8 w-8 bg-emerald-500 rounded-full" 
                             />
                           </div>
                           
                           <div>
                             <h2 className="text-4xl font-black text-slate-900 mb-4">You're Ready to Lead!</h2>
                             <p className="text-xl text-slate-500 max-w-lg mx-auto">
                               As a RAHI Partner, you'll have access to large scale service requests and a suite of management tools.
                             </p>
                           </div>

                           <div className="max-w-md mx-auto p-6 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200">
                             <div className="flex items-start gap-3 text-left">
                               <Checkbox 
                                 id="terms-p" 
                                 checked={formData.terms}
                                 onCheckedChange={(c) => setFormData({...formData, terms: c === true})}
                               />
                               <Label htmlFor="terms-p" className="text-sm text-slate-600 font-medium">
                                 I confirm all business info is accurate and I agree to abide by RAHIs quality standards and fair payment policies.
                               </Label>
                             </div>
                           </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>

                <CardFooter className="p-8 md:p-12 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    disabled={step === 1 || loading}
                    className="md:w-32 h-14 rounded-2xl font-bold text-slate-500"
                  >
                    Back
                  </Button>
                  <div className="flex-1" />
                  {step < totalSteps ? (
                    <Button 
                      onClick={handleNext} 
                      className="w-full md:w-64 h-14 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!formData.terms || loading}
                      className="w-full md:w-64 h-14 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl"
                    >
                      {loading ? (
                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// --- Sub-components reuse ---

const HeaderSection = ({ title, subtitle, icon: Icon, color }: any) => (
  <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
    <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center bg-white shadow-lg", color)}>
      <Icon className="h-8 w-8" />
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900">{title}</h3>
      <p className="text-slate-500 font-medium tracking-tight font-display">{subtitle}</p>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, disabled, type = 'text' }: any) => (
  <div className="space-y-3">
    <Label className="text-lg font-bold">{label}</Label>
    <Input 
      disabled={disabled}
      type={type}
      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-medium focus:ring-emerald-500 focus:bg-white transition-all text-lg"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const UploadCard = ({ title, subtitle, optional, icon: Icon }: any) => (
  <div className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50/50 hover:bg-white hover:border-emerald-500/50 transition-all cursor-pointer">
    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
      <Icon className="h-8 w-8 text-slate-400 group-hover:text-emerald-600" />
    </div>
    <div className="flex flex-col gap-1 mb-6">
      <h4 className="font-bold text-slate-800 flex items-center justify-center gap-2">
        {title} 
        {optional && <span className="text-[10px] uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-500">Optional</span>}
      </h4>
      <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
    </div>
    <Button variant="outline" className="rounded-xl border-slate-200 font-bold bg-white group-hover:bg-emerald-600 group-hover:text-white transition-all">
      <Upload className="h-4 w-4 mr-2" />
      Upload File
    </Button>
  </div>
);

export default ThekedarOnboardingPage;