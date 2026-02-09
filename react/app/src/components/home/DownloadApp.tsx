import { Smartphone, Download, Star, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function DownloadApp() {
  const { language } = useLanguage();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Smartphone className="h-4 w-4" />
              {language === 'hi' ? 'मोबाइल ऐप' : 'Mobile App'}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              {language === 'hi' 
                ? 'राही ऐप डाउनलोड करें'
                : 'Download RAHI App'
              }
            </h2>

            <p className="text-lg text-muted-foreground">
              {language === 'hi'
                ? 'अपने फोन पर इंस्टॉल करें और कहीं से भी सेवा बुक करें'
                : 'Install on your phone and book services from anywhere'
              }
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-5 w-5 text-amber-500" />
                <span>4.8 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-5 w-5 text-primary" />
                <span>50K+ Downloads</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span>100% Secure</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                <Zap className="h-5 w-5" />
                {language === 'hi' ? 'अभी इंस्टॉल करें' : 'Install Now'}
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Smartphone className="h-5 w-5" />
                {language === 'hi' ? 'होम स्क्रीन पर जोड़ें' : 'Add to Home Screen'}
              </Button>
            </div>
          </div>

          <div className="relative hidden md:flex justify-center">
            <div className="relative w-64 h-[500px] bg-gradient-to-br from-primary to-primary/80 rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-4xl mx-auto mb-4">
                    R
                  </div>
                  <h3 className="text-xl font-bold text-primary">RAHI</h3>
                  <p className="text-sm text-muted-foreground mt-1">राही</p>
                  <p className="text-xs text-muted-foreground mt-4 max-w-[150px] mx-auto">
                    {language === 'hi' 
                      ? 'विश्वास, निष्पक्षता और काम को सम्मान से जोड़ना'
                      : 'Connecting Belief, Fairness & Work with Dignity'
                    }
                  </p>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute top-10 -left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-bounce">
              ₹264 Earned!
            </div>
            <div className="absolute bottom-20 -right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
              ⭐ 4.9 Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
