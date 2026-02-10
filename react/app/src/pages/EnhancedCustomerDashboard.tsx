import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Star, IndianRupee, 
  Package, Settings, Bell, Search, Filter,
  ChevronRight, Plus, TrendingUp, Award, CheckCircle, Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
// import { supabase } from '@/integrations/supabase/client';
import { db } from '@/lib/db';
import { Layout } from '@/components/layout/Layout';

const mockBookings = [
  {
    id: '1',
    service: 'AC Repair',
    serviceHi: 'एसी रिपेयर',
    worker: 'Ramesh Kumar',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'completed',
    amount: 450,
    rating: 4.8,
    location: 'Delhi, Sector 15'
  },
  {
    id: '2',
    service: 'Plumbing',
    serviceHi: 'प्लंबिंग',
    worker: 'Suresh Patel',
    date: '2024-01-18',
    time: '2:00 PM',
    status: 'upcoming',
    amount: 320,
    location: 'Delhi, Sector 22'
  },
  {
    id: '3',
    service: 'Electrician',
    serviceHi: 'इलेक्ट्रीशियन',
    worker: 'Mahesh Singh',
    date: '2024-01-12',
    time: '11:30 AM',
    status: 'cancelled',
    amount: 280,
    location: 'Delhi, Sector 18'
  }
];

const stats = [
  { label: 'Total Bookings', labelHi: 'कुल बुकिंग', value: '24', icon: Package, color: 'text-blue-500' },
  { label: 'Amount Spent', labelHi: 'खर्च की गई राशि', value: '₹8,450', icon: IndianRupee, color: 'text-green-500' },
  { label: 'Avg Rating', labelHi: 'औसत रेटिंग', value: '4.7', icon: Star, color: 'text-amber-500' },
  { label: 'Saved Time', labelHi: 'बचा समय', value: '42 hrs', icon: Clock, color: 'text-purple-500' }
];

export default function EnhancedCustomerDashboard() {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [bookings, setBookings] = useState<any[]>(mockBookings);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(stats);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await db
          .collection('bookings')
          .select(`
            *,
            service_categories(name, name_hi)
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted = data.map((b: any) => ({
            id: b.id,
            service: b.service_categories?.name || 'Service',
            serviceHi: b.service_categories?.name_hi || 'सेवा',
            worker: 'Assigned Professional',
            date: b.scheduled_at?.split('T')[0] || 'Today',
            time: b.scheduled_at?.split('T')[1]?.substring(0, 5) || '10:00 AM',
            status: b.status,
            amount: b.total_price,
            location: b.address
          }));
          
          if (formatted.length > 0) {
            setBookings(formatted);
            
            // Calculate real stats
            const totalSpent = formatted.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
            const newStats = [...stats];
            newStats[0].value = formatted.length.toString();
            newStats[1].value = `₹${totalSpent.toLocaleString()}`;
            setDashboardStats(newStats);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  const filteredBookings = bookings.filter(booking => 
    booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.worker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'hi') {
      switch (status) {
        case 'completed': return 'पूर्ण';
        case 'upcoming': return 'आगामी';
        case 'cancelled': return 'रद्द';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {language === 'hi' ? 'ग्राहक डैशबोर्ड' : 'Customer Dashboard'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'hi' 
                  ? `स्वागत है, ${profile?.full_name || user?.email}` 
                  : `Welcome, ${profile?.full_name || user?.email}`
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'सूचनाएं' : 'Notifications'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'hi' ? stat.labelHi : stat.label}
                      </p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-')}/10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'अवलोकन' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'बुकिंग' : 'Bookings'}
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Award className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'पसंदीदा' : 'Favorites'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  {language === 'hi' ? 'तेज़ एक्शन' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    className="h-20 flex flex-col gap-2 shadow-lg shadow-primary/10"
                    onClick={() => navigate('/services')}
                  >
                    <Plus className="h-6 w-6" />
                    {language === 'hi' ? 'नई बुकिंग' : 'New Booking'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-slate-200"
                    onClick={() => navigate('/live-tracking')}
                  >
                    <MapPin className="h-6 w-6" />
                    {language === 'hi' ? 'ट्रैकिंग' : 'Tracking'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-slate-200"
                    onClick={() => navigate('/payment')}
                  >
                    <Wallet className="h-6 w-6" />
                    {language === 'hi' ? 'वॉलेट' : 'Wallet'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-slate-200"
                  >
                    <Star className="h-6 w-6" />
                    {language === 'hi' ? 'रेटिंग' : 'Rating'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi' ? 'हाल की बुकिंग' : 'Recent Bookings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {language === 'hi' ? booking.serviceHi : booking.service}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.worker} • {booking.date}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        ₹{booking.amount}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi' ? 'पसंदीदा सेवाएं' : 'Favorite Services'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['AC Repair', 'Plumbing', 'Electrician'].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <span className="font-medium">
                        {language === 'hi' 
                          ? (service === 'AC Repair' ? 'एसी रिपेयर' : 
                             service === 'Plumbing' ? 'प्लंबिंग' : 'इलेक्ट्रीशियन')
                          : service
                        }
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'hi' ? 'बुकिंग खोजें...' : 'Search bookings...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {language === 'hi' ? 'फ़िल्टर' : 'Filter'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {language === 'hi' ? booking.serviceHi : booking.service}
                            </h3>
                            <p className="text-muted-foreground">{booking.worker}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{booking.amount}</p>
                            {booking.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm">{booking.rating}</span>
                              </div>
                            )}
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'hi' ? 'आपकी पसंदीदा सेवाएं' : 'Your Favorite Services'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'AC Repair', nameHi: 'एसी रिपेयर', price: '₹299+' },
                    { name: 'Plumbing', nameHi: 'प्लंबिंग', price: '₹199+' },
                    { name: 'Electrician', nameHi: 'इलेक्ट्रीशियन', price: '₹249+' },
                    { name: 'Painter', nameHi: 'पेंटर', price: '₹399+' },
                    { name: 'Carpenter', nameHi: 'कारपेंटर', price: '₹279+' },
                    { name: 'Cleaning', nameHi: 'क्लीनिंग', price: '₹149+' }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/book/${service.name.toLowerCase().replace(' ', '-')}`)}
                    >
                      <h4 className="font-semibold mb-2">
                        {language === 'hi' ? service.nameHi : service.name}
                      </h4>
                      <p className="text-primary font-bold">{service.price}</p>
                      <Button size="sm" className="w-full mt-3">
                        {language === 'hi' ? 'बुक करें' : 'Book Now'}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </Layout>
  );
}