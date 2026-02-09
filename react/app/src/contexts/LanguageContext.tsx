import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'bn' | 'gu' | 'mr' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App
    'app.name': 'RAHI',
    'app.tagline': 'Connecting Skills with Opportunities',
    'app.subtitle': 'Fair Work. Fair Pay. Dignity for All.',
    
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.bookings': 'My Bookings',
    'nav.earnings': 'Earnings',
    'nav.profile': 'Profile',
    'nav.help': 'Help',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Roles
    'role.worker': 'Worker',
    'role.customer': 'Customer',
    'role.thekedar': 'Thekedar',
    'role.partner': 'Partner',
    'role.worker.desc': 'Find jobs & showcase skills',
    'role.customer.desc': 'Hire verified workers',
    'role.thekedar.desc': 'Manage teams & jobs',
    'role.partner.desc': 'NGOs & Institutions',
    
    // Auth
    'auth.login': 'Login / Register',
    'auth.phone': 'Phone Number',
    'auth.otp': 'Enter OTP',
    'auth.send_otp': 'Send OTP',
    'auth.verify': 'Verify',
    'auth.welcome': 'Welcome to RAHI',
    
    // Services
    'services.title': 'Our Services',
    'services.book_now': 'Book Now',
    'services.view_all': 'View All Services',
    
    // Booking
    'booking.instant': 'Instant Booking',
    'booking.scheduled': 'Schedule for Later',
    'booking.emergency': 'Emergency',
    'booking.confirm': 'Confirm Booking',
    'booking.searching': 'Finding best worker...',
    'booking.matched': 'Worker Found!',
    'booking.arriving': 'Worker is on the way',
    'booking.otp_start': 'Share OTP to start job',
    'booking.in_progress': 'Job in Progress',
    'booking.completed': 'Job Completed',
    'booking.rate': 'Rate your experience',
    
    // Worker
    'worker.online': 'Go Online',
    'worker.offline': 'Go Offline',
    'worker.busy': 'Busy',
    'worker.new_job': 'New Job Request',
    'worker.accept': 'Accept',
    'worker.reject': 'Reject',
    'worker.earnings_today': "Today's Earnings",
    'worker.total_jobs': 'Total Jobs',
    'worker.rating': 'Your Rating',
    'worker.withdraw': 'Withdraw',
    'worker.verified': 'Verified Worker',
    
    // Pricing
    'price.transparent': 'Transparent Pricing',
    'price.worker_earning': 'Worker Earning',
    'price.platform_fee': 'Platform Fee (10%)',
    'price.total': 'Total',
    'price.welfare': 'Welfare Fund Contribution',
    
    // Features
    'feature.instant': 'Instant Match',
    'feature.instant.desc': 'Get connected in under 60 seconds',
    'feature.verified': 'Verified Workers',
    'feature.verified.desc': 'All workers are KYC verified',
    'feature.fair': 'Fair Pricing',
    'feature.fair.desc': 'Only 8-12% commission',
    'feature.tracking': 'Live Tracking',
    'feature.tracking.desc': 'Track worker in real-time',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.read_all': 'Read All',
    'notifications.clear': 'Clear',
    'notifications.empty': 'No notifications',
    'notifications.booking': 'Booking',
    'notifications.arrival': 'Arrival',
    'notifications.otp': 'OTP',
    'notifications.completed': 'Completed',
    'notifications.payment': 'Payment',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.done': 'Done',
    'common.search': 'Search',
    'common.location': 'Your Location',
    'common.change': 'Change',
  },
  hi: {
    // App
    'app.name': 'राही',
    'app.tagline': 'कौशल को अवसर से जोड़ना',
    'app.subtitle': 'उचित काम। उचित वेतन। सम्मान सभी के लिए।',
    
    // Navigation
    'nav.home': 'होम',
    'nav.services': 'सेवाएं',
    'nav.bookings': 'मेरी बुकिंग',
    'nav.earnings': 'कमाई',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.help': 'मदद',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    
    // Roles
    'role.worker': 'कारीगर',
    'role.customer': 'ग्राहक',
    'role.thekedar': 'ठेकेदार',
    'role.partner': 'साझेदार',
    'role.worker.desc': 'काम खोजें और कौशल दिखाएं',
    'role.customer.desc': 'सत्यापित कारीगर किराए पर लें',
    'role.thekedar.desc': 'टीम और काम प्रबंधित करें',
    'role.partner.desc': 'NGO और संस्थाएं',
    
    // Auth
    'auth.login': 'लॉगिन / रजिस्टर',
    'auth.phone': 'फ़ोन नंबर',
    'auth.otp': 'OTP दर्ज करें',
    'auth.send_otp': 'OTP भेजें',
    'auth.verify': 'सत्यापित करें',
    'auth.welcome': 'राही में आपका स्वागत है',
    
    // Services
    'services.title': 'हमारी सेवाएं',
    'services.book_now': 'अभी बुक करें',
    'services.view_all': 'सभी सेवाएं देखें',
    
    // Booking
    'booking.instant': 'तुरंत बुकिंग',
    'booking.scheduled': 'बाद के लिए शेड्यूल',
    'booking.emergency': 'आपातकाल',
    'booking.confirm': 'बुकिंग की पुष्टि करें',
    'booking.searching': 'सबसे अच्छा कारीगर खोज रहे हैं...',
    'booking.matched': 'कारीगर मिल गया!',
    'booking.arriving': 'कारीगर रास्ते में है',
    'booking.otp_start': 'काम शुरू करने के लिए OTP साझा करें',
    'booking.in_progress': 'काम जारी है',
    'booking.completed': 'काम पूरा हुआ',
    'booking.rate': 'अपना अनुभव रेट करें',
    
    // Worker
    'worker.online': 'ऑनलाइन जाएं',
    'worker.offline': 'ऑफलाइन जाएं',
    'worker.busy': 'व्यस्त',
    'worker.new_job': 'नया काम का अनुरोध',
    'worker.accept': 'स्वीकार करें',
    'worker.reject': 'अस्वीकार करें',
    'worker.earnings_today': 'आज की कमाई',
    'worker.total_jobs': 'कुल काम',
    'worker.rating': 'आपकी रेटिंग',
    'worker.withdraw': 'निकालें',
    'worker.verified': 'सत्यापित कारीगर',
    
    // Pricing
    'price.transparent': 'पारदर्शी मूल्य',
    'price.worker_earning': 'कारीगर की कमाई',
    'price.platform_fee': 'प्लेटफ़ॉर्म शुल्क (10%)',
    'price.total': 'कुल',
    'price.welfare': 'कल्याण कोष योगदान',
    
    // Features
    'feature.instant': 'तुरंत मिलान',
    'feature.instant.desc': '60 सेकंड में जुड़ें',
    'feature.verified': 'सत्यापित कारीगर',
    'feature.verified.desc': 'सभी कारीगर KYC सत्यापित',
    'feature.fair': 'उचित मूल्य',
    'feature.fair.desc': 'केवल 8-12% कमीशन',
    'feature.tracking': 'लाइव ट्रैकिंग',
    'feature.tracking.desc': 'कारीगर को रियल-टाइम में ट्रैक करें',
    
    // Notifications
    'notifications.title': 'सूचनाएं',
    'notifications.read_all': 'सभी पढ़ें',
    'notifications.clear': 'साफ करें',
    'notifications.empty': 'कोई सूचना नहीं',
    'notifications.booking': 'बुकिंग',
    'notifications.arrival': 'आगमन',
    'notifications.otp': 'OTP',
    'notifications.completed': 'पूर्ण',
    'notifications.payment': 'भुगतान',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.retry': 'पुनः प्रयास करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.next': 'अगला',
    'common.back': 'वापस',
    'common.done': 'हो गया',
    'common.search': 'खोजें',
    'common.location': 'आपका स्थान',
    'common.change': 'बदलें',
  },
  bn: {
    'app.name': 'রাহি',
    'app.tagline': 'দক্ষতাকে সুযোগের সাথে সংযুক্ত করা',
    'app.subtitle': 'ন্যায্য কাজ। ন্যায্য বেতন। সকলের জন্য মর্যাদা।',
    'nav.home': 'হোম',
    'nav.services': 'সেবা',
    'nav.bookings': 'আমার বুকিং',
    'role.worker': 'কর্মী',
    'role.customer': 'গ্রাহক',
    'auth.login': 'লগইন / নিবন্ধন',
    'services.title': 'আমাদের সেবা',
    'services.book_now': 'এখনই বুক করুন',
    'common.loading': 'লোড হচ্ছে...',
  },
  gu: {
    'app.name': 'રાહી',
    'app.tagline': 'કૌશલ્યને તકો સાથે જોડવું',
    'app.subtitle': 'ન્યાયી કામ। ન્યાયી વેતન। બધા માટે ગૌરવ.',
    'nav.home': 'હોમ',
    'nav.services': 'સેવાઓ',
    'nav.bookings': 'મારી બુકિંગ',
    'role.worker': 'કામદાર',
    'role.customer': 'ગ્રાહક',
    'auth.login': 'લૉગિન / નોંધણી',
    'services.title': 'અમારી સેવાઓ',
    'services.book_now': 'હમણાં બુક કરો',
    'common.loading': 'લોડ થઈ રહ્યું છે...',
  },
  mr: {
    'app.name': 'राही',
    'app.tagline': 'कौशल्य संधींशी जोडणे',
    'app.subtitle': 'न्याय्य काम। न्याय्य वेतन। सर्वांसाठी सन्मान.',
    'nav.home': 'होम',
    'nav.services': 'सेवा',
    'nav.bookings': 'माझी बुकिंग',
    'role.worker': 'कामगार',
    'role.customer': 'ग्राहक',
    'auth.login': 'लॉगिन / नोंदणी',
    'services.title': 'आमच्या सेवा',
    'services.book_now': 'आता बुक करा',
    'common.loading': 'लोड होत आहे...',
  },
  ta: {
    'app.name': 'ராஹி',
    'app.tagline': 'திறன்களை வாய்ப்புகளுடன் இணைத்தல்',
    'app.subtitle': 'நியாயமான வேலை। நியாயமான ஊதியம். அனைவருக்கும் கண்ணியம்.',
    'nav.home': 'முகப்பு',
    'nav.services': 'சேவைகள்',
    'nav.bookings': 'என் புக்கிங்',
    'role.worker': 'தொழிலாளி',
    'role.customer': 'வாடிக்கையாளர்',
    'auth.login': 'உள்நுழைவு / பதிவு',
    'services.title': 'எங்கள் சேவைகள்',
    'services.book_now': 'இப்போது புக் செய்',
    'common.loading': 'ஏற்றுகிறது...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('rahi-language') as Language;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rahi-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export const languageOptions: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];
