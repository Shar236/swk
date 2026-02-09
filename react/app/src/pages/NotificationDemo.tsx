import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Bell, Zap, Truck, Key, CheckCircle, 
  IndianRupee, UserPlus, Calendar, AlertTriangle 
} from 'lucide-react';

export default function NotificationDemo() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { language, t } = useLanguage();
  const [demoCount, setDemoCount] = useState(0);

  const demoNotifications = [
    {
      type: 'booking_update',
      title: language === 'hi' ? 'नई बुकिंग' : 'New Booking',
      message: language === 'hi' 
        ? 'आपकी प्लंबर सेवा की बुकिंग सफलतापूर्वक बन गई है' 
        : 'Your plumber service booking has been created successfully',
      icon: Calendar,
    },
    {
      type: 'worker_arrival',
      title: language === 'hi' ? 'कारीगर आ रहे हैं!' : 'Worker Found!',
      message: language === 'hi'
        ? 'प्लंबर कारीगर आपके लिए तैयार हैं'
        : 'Plumber worker is ready for you',
      icon: UserPlus,
    },
    {
      type: 'worker_arrival',
      title: language === 'hi' ? 'कारीगर रास्ते में है' : 'Worker is on the way',
      message: language === 'hi'
        ? 'कारीगर 15 मिनट में पहुंचेंगे'
        : 'Worker will arrive in 15 minutes',
      icon: Truck,
    },
    {
      type: 'otp_alert',
      title: language === 'hi' ? 'OTP तैयार है' : 'OTP Ready',
      message: language === 'hi'
        ? 'काम शुरू करने के लिए OTP: 4521'
        : 'OTP to start work: 4521',
      icon: Key,
    },
    {
      type: 'job_completion',
      title: language === 'hi' ? 'काम पूरा हुआ!' : 'Work Completed!',
      message: language === 'hi'
        ? 'प्लंबर कारीगर ने काम पूरा कर दिया है'
        : 'Plumber worker has completed the work',
      icon: CheckCircle,
    },
    {
      type: 'payment_received',
      title: language === 'hi' ? 'भुगतान सफल' : 'Payment Successful',
      message: language === 'hi'
        ? '₹300 का भुगतान सफलतापूर्वक हो गया'
        : 'Payment of ₹300 completed successfully',
      icon: IndianRupee,
    },
  ];

  const triggerRandomNotification = () => {
    const randomIndex = Math.floor(Math.random() * demoNotifications.length);
    const notification = demoNotifications[randomIndex];
    
    addNotification({
      type: notification.type as any,
      title: notification.title,
      message: notification.message,
      data: { demo: true },
    });
    
    setDemoCount(prev => prev + 1);
  };

  const triggerAllNotifications = () => {
    demoNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification({
          type: notification.type as any,
          title: notification.title,
          message: notification.message,
          data: { demo: true },
        });
      }, index * 1000);
    });
    setDemoCount(prev => prev + demoNotifications.length);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {language === 'hi' ? 'सूचना डेमो' : 'Notification Demo'}
          </h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            {language === 'hi' ? 'होम पर जाएं' : 'Go Home'}
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'hi' ? 'डेमो नियंत्रण' : 'Demo Controls'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={triggerRandomNotification}
                className="h-12"
              >
                <Bell className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'यादृच्छिक सूचना' : 'Random Notification'}
              </Button>
              
              <Button 
                onClick={triggerAllNotifications}
                variant="secondary"
                className="h-12"
              >
                <Zap className="h-5 w-5 mr-2" />
                {language === 'hi' ? 'सभी सूचनाएं ट्रिगर करें' : 'Trigger All Notifications'}
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {language === 'hi' 
                  ? `कुल सूचनाएं: ${demoCount}` 
                  : `Total Notifications: ${demoCount}`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'hi' ? 'सूचना प्रकार' : 'Notification Types'}
            </h2>
            
            <div className="space-y-4">
              {demoNotifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.icon && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <notification.icon className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-secondary">
                      {notification.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            {language === 'hi' 
              ? 'बेल आइकन पर क्लिक करके सूचनाएं देखें' 
              : 'Click the bell icon to view notifications'
            }
          </p>
        </div>
      </div>
    </div>
  );
}