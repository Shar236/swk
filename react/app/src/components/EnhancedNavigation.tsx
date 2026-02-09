import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function EnhancedNavigation() {
  const { language } = useLanguage();

  const demoLinks = [
    {
      path: '/',
      label: language === 'hi' ? 'मुख्य पृष्ठ' : 'Home Page',
      description: language === 'hi' ? 'नवीनतम डिज़ाइन' : 'Latest Design'
    },
    {
      path: '/customer-dashboard',
      label: language === 'hi' ? 'ग्राहक डैशबोर्ड' : 'Customer Dashboard',
      description: language === 'hi' ? 'व्यक्तिगत क्षेत्र' : 'Personal Area'
    },
    {
      path: '/enhanced-book/ac-repair',
      label: language === 'hi' ? 'बुकिंग प्रक्रिया' : 'Booking Process',
      description: language === 'hi' ? 'सुधारित यूजर एक्सपीरियंस' : 'Enhanced UX'
    },
    {
      path: '/workers',
      label: language === 'hi' ? 'पेशेवर शोकेस' : 'Professional Showcase',
      description: language === 'hi' ? 'विशेषज्ञ पेशेवर' : 'Expert Professionals'
    },
    {
      path: '/enhanced-login',
      label: language === 'hi' ? 'लॉगिन पृष्ठ' : 'Login Page',
      description: language === 'hi' ? 'सुधारित प्रमाणीकरण' : 'Enhanced Auth'
    },
    {
      path: '/services',
      label: language === 'hi' ? 'सभी सेवाएं' : 'All Services',
      description: language === 'hi' ? 'मौजूदा पृष्ठ' : 'Existing Page'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-card border rounded-lg shadow-lg p-4 space-y-3 max-w-xs">
        <h3 className="font-bold text-sm mb-2">
          {language === 'hi' ? 'डेमो पृष्ठ' : 'Demo Pages'}
        </h3>
        <div className="space-y-2">
          {demoLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start h-auto py-2 text-left"
              >
                <div>
                  <div className="font-medium text-sm">{link.label}</div>
                  <div className="text-xs text-muted-foreground">{link.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}