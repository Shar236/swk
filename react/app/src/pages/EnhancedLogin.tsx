import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, 
  Shield, Zap, Star, ArrowRight, Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

type LoginMode = 'customer' | 'worker' | 'thekedar';

export default function EnhancedLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { language } = useLanguage();
  
  const [loginMode, setLoginMode] = useState<LoginMode>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (signIn) {
        await signIn(email, password);
      }
      
      // Redirect based on role
      if (loginMode === 'customer') {
        navigate('/');
      } else if (loginMode === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/thekedar/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const modeConfig = {
    customer: {
      title: language === 'hi' ? 'ग्राहक लॉगिन' : 'Customer Login',
      subtitle: language === 'hi' ? 'अपनी सेवाएं प्राप्त करें' : 'Access your services',
      color: 'from-blue-500 to-cyan-500',
      icon: User
    },
    worker: {
      title: language === 'hi' ? 'कारीगर लॉगिन' : 'Worker Login',
      subtitle: language === 'hi' ? 'अपनी कमाई प्रबंधित करें' : 'Manage your earnings',
      color: 'from-emerald-500 to-teal-500',
      icon: Shield
    },
    thekedar: {
      title: language === 'hi' ? 'ठेकेदार लॉगिन' : 'Contractor Login',
      subtitle: language === 'hi' ? 'अपनी टीम प्रबंधित करें' : 'Manage your team',
      color: 'from-purple-500 to-fuchsia-500',
      icon: Star
    }
  };

  const currentMode = modeConfig[loginMode];
  const Icon = currentMode.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl"></div>
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mode Selector */}
        <div className="flex rounded-lg bg-card border p-1 mb-8">
          {(Object.keys(modeConfig) as LoginMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setLoginMode(mode)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                loginMode === mode
                  ? `bg-gradient-to-r ${modeConfig[mode].color} text-white shadow-md`
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {modeConfig[mode].title.split(' ')[0]}
            </button>
          ))}
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${currentMode.color} mb-4`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{currentMode.title}</CardTitle>
            <CardDescription>{currentMode.subtitle}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12">
                <Zap className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'गूगल के साथ जारी रखें' : 'Continue with Google'}
              </Button>
              <Button variant="outline" className="w-full h-12">
                <Facebook className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'फेसबुक के साथ जारी रखें' : 'Continue with Facebook'}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {language === 'hi' ? 'या ईमेल के साथ' : 'Or continue with email'}
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={language === 'hi' ? 'अपना ईमेल दर्ज करें' : 'Enter your email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={language === 'hi' ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className={`w-full h-12 text-lg bg-gradient-to-r ${currentMode.color}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {language === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging in...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {language === 'hi' ? 'लॉगिन करें' : 'Login'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="text-center space-y-3 pt-4">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
              </Link>
              
              <div className="text-sm text-muted-foreground">
                {language === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
                <Link 
                  to="/register" 
                  className="text-primary font-medium hover:underline"
                >
                  {language === 'hi' ? 'रजिस्टर करें' : 'Register'}
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 rounded-b-2xl">
            <div className="w-full text-center">
              <p className="text-xs text-muted-foreground">
                {language === 'hi' 
                  ? 'आपकी सुरक्षा हमारी प्राथमिकता है' 
                  : 'Your security is our priority'
                }
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">
                  {language === 'hi' ? '100% सुरक्षित लॉगिन' : '100% Secure Login'}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 mt-8 text-center">
          {[
            { icon: Shield, text: language === 'hi' ? 'सुरक्षित' : 'Secure' },
            { icon: Zap, text: language === 'hi' ? 'तेज़' : 'Fast' },
            { icon: Star, text: language === 'hi' ? 'विश्वसनीय' : 'Trusted' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}