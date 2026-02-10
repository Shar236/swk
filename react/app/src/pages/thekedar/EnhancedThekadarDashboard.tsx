import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  Target,
  Plus,
  Eye,
  Map,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Star,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ChatComponent from '@/components/chat/ChatComponent';

// Mock data for demonstration
const mockStats = {
  upcomingVisits: 12,
  activeProjects: 8,
  teamMembers: 15,
  totalEarnings: 245000,
  monthlyEarnings: 42500,
  commissionEarned: 18750,
  projectCompletionRate: 94
};

const mockVisits = [
  {
    id: '1',
    customer: 'Rajesh Kumar',
    address: '123 MG Road, Delhi',
    date: '2024-01-29',
    status: 'pending',
    type: 'House Renovation'
  },
  {
    id: '2',
    customer: 'Priya Sharma',
    address: '456 Sector 15, Noida',
    date: '2024-01-30',
    status: 'scheduled',
    type: 'Electrical Work'
  },
  {
    id: '3',
    customer: 'Amit Patel',
    address: '789 East Street, Ghaziabad',
    date: '2024-01-28',
    status: 'completed',
    type: 'Plumbing'
  }
];

const mockTeam = [
  {
    id: '1',
    name: 'Ramesh Gupta',
    role: 'Electrician',
    rating: 4.8,
    projects: 42,
    status: 'active'
  },
  {
    id: '2',
    name: 'Suresh Yadav',
    role: 'Plumber',
    rating: 4.6,
    projects: 38,
    status: 'active'
  },
  {
    id: '3',
    name: 'Mahesh Singh',
    role: 'Carpenter',
    rating: 4.9,
    projects: 56,
    status: 'active'
  }
];

const EnhancedThekadarDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [recentVisits, setRecentVisits] = useState(mockVisits);
  const [teamMembers, setTeamMembers] = useState(mockTeam);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New site visit request from Rajesh Kumar', time: '2 hours ago', type: 'visit' },
    { id: 2, title: 'Payment received for completed project', time: '5 hours ago', type: 'payment' },
    { id: 3, title: 'Team member Suresh Yadav completed training', time: '1 day ago', type: 'team' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, color = "text-thekedar-secondary" }: any) => (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-thekedar-light/10 border-thekedar-primary/20 hover:border-thekedar-primary/40 hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-thekedar-primary/10">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {change && (
          <div className="flex items-center mt-1">
            <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-thekedar-primary/5 to-thekedar-secondary/5 rounded-2xl border border-thekedar-primary/10 animate-slide-in-left">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-thekedar-accent animate-pulse"></div>
            Welcome back, {profile?.full_name || 'Thekadar'}!
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2 bg-thekedar-primary hover:bg-thekedar-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <Button variant="outline" className="gap-2 border-thekedar-primary/50 text-thekedar-primary hover:bg-thekedar-primary hover:text-white transition-all duration-300 hover-scale">
            <MapPin className="h-4 w-4" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
        <StatCard 
          title="Upcoming Visits" 
          value={stats.upcomingVisits} 
          icon={MapPin} 
          change={12}
        />
        <StatCard 
          title="Active Projects" 
          value={stats.activeProjects} 
          icon={Briefcase} 
          change={8}
        />
        <StatCard 
          title="Team Members" 
          value={stats.teamMembers} 
          icon={Users} 
          change={15}
        />
        <StatCard 
          title="Monthly Earnings" 
          value={`₹${stats.monthlyEarnings.toLocaleString()}`} 
          icon={DollarSign} 
          change={18}
          color="text-thekedar-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Site Visits */}
          <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-thekedar-primary/10">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-thekedar-light/20 to-transparent">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <div className="p-2 rounded-lg bg-thekedar-primary/10">
                    <MapPin className="h-5 w-5 text-thekedar-primary" />
                  </div>
                  Recent Site Visits
                </CardTitle>
                <CardDescription className="text-gray-600">Upcoming and recent customer visits</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-thekedar-primary/30 text-thekedar-primary hover:bg-thekedar-primary hover:text-white transition-all duration-300">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVisits.map((visit, index) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-thekedar-light/20 transition-all duration-300 hover-scale border-thekedar-primary/10 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center gap-4">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                        visit.status === 'completed' ? 'bg-green-500' :
                        visit.status === 'scheduled' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}>
                        {visit.status === 'completed' && <CheckCircle className="h-2 w-2 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{visit.customer}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {visit.address}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 bg-thekedar-light/30 px-2 py-1 rounded-full inline-block">{visit.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          visit.status === 'completed' ? 'default' :
                          visit.status === 'scheduled' ? 'outline' :
                          'secondary'
                        }
                        className={
                          visit.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                          visit.status === 'scheduled' ? 'border-blue-500 text-blue-600' :
                          'bg-yellow-500 hover:bg-yellow-600'
                        }
                      >
                        {visit.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(visit.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-thekedar-primary/10">
            <CardHeader className="bg-gradient-to-r from-thekedar-secondary/10 to-thekedar-accent/10">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 rounded-lg bg-thekedar-secondary/10">
                  <BarChart3 className="h-5 w-5 text-thekedar-secondary" />
                </div>
                Business Performance
              </CardTitle>
              <CardDescription className="text-gray-600">Monthly earnings and project trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-thekedar-light/30 to-thekedar-accent/20 rounded-xl flex items-center justify-center border-2 border-dashed border-thekedar-primary/20 hover:border-thekedar-primary/40 transition-colors duration-300">
                <div className="text-center animate-fade-in">
                  <Activity className="h-12 w-12 text-thekedar-secondary mx-auto mb-3 animate-pulse-slow" />
                  <p className="font-bold text-thekedar-dark text-lg">Performance Dashboard</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Interactive charts showing your business growth
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:scale-105 transition-transform duration-300 hover-lift">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">24%</p>
                  <p className="text-xs text-green-600 font-medium">Growth</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:scale-105 transition-transform duration-300 hover-lift">
                  <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">94%</p>
                  <p className="text-xs text-blue-600 font-medium">Completion</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 hover:scale-105 transition-transform duration-300 hover-lift">
                  <Star className="h-6 w-6 text-amber-600 mx-auto mb-2 fill-current" />
                  <p className="text-2xl font-bold text-amber-700">4.8★</p>
                  <p className="text-xs text-amber-600 font-medium">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Overview */}
          <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-thekedar-primary/10">
            <CardHeader className="bg-gradient-to-r from-thekedar-primary/5 to-thekedar-secondary/5">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 rounded-lg bg-thekedar-primary/10">
                  <Users className="h-5 w-5 text-thekedar-primary" />
                </div>
                My Team
              </CardTitle>
              <CardDescription className="text-gray-600">Top performing team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.slice(0, 3).map((member, index) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-thekedar-light/20 to-transparent rounded-xl border border-thekedar-primary/10 hover:bg-thekedar-light/30 transition-all duration-300 hover-scale animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-thekedar-primary to-thekedar-secondary flex items-center justify-center shadow-md">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-thekedar-primary font-medium">{member.role}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <span className="text-sm font-bold text-amber-700">{member.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Briefcase className="h-3 w-3" />
                          <span className="text-xs">{member.projects} projects</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                      {member.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-thekedar-primary/30 text-thekedar-primary hover:bg-thekedar-primary hover:text-white transition-all duration-300 hover-scale mt-2">
                  View All Team Members
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-thekedar-accent/20">
            <CardHeader className="bg-gradient-to-r from-thekedar-accent/10 to-amber-100/20">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 rounded-lg bg-thekedar-accent/10">
                  <Award className="h-5 w-5 text-thekedar-accent" />
                </div>
                Achievement Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 hover:scale-105 transition-transform duration-300 hover-lift">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Top Performer</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-yellow-500 text-white">🏆</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:scale-105 transition-transform duration-300 hover-lift">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Consistent Growth</p>
                  <p className="text-sm text-gray-600">12 months running</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-blue-500 text-white">📈</Badge>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Project Completion Rate</span>
                  <span className="text-thekedar-secondary">{stats.projectCompletionRate}%</span>
                </div>
                <Progress value={stats.projectCompletionRate} className="h-3 bg-thekedar-light/30" />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Excellent performance maintained consistently
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-thekedar-primary/10">
            <CardHeader className="bg-gradient-to-r from-thekedar-light/20 to-transparent">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 rounded-lg bg-thekedar-primary/10">
                  <Bell className="h-5 w-5 text-thekedar-primary" />
                </div>
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={notification.id} className="p-4 bg-gradient-to-r from-thekedar-light/20 to-transparent rounded-xl border border-thekedar-primary/10 hover:bg-thekedar-light/30 transition-all duration-300 hover-scale animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                          <Badge variant="secondary" className="text-xs bg-thekedar-light/50 text-thekedar-primary border-thekedar-primary/20">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-thekedar-accent animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Cards */}
      <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-thekedar-primary/10">
        <CardHeader className="bg-gradient-to-r from-thekedar-primary/5 to-thekedar-secondary/5">
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600">Manage your business efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex flex-col items-center h-auto py-6 gap-3 bg-gradient-to-br from-thekedar-primary to-thekedar-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-scale rounded-xl">
              <MapPin className="h-6 w-6" />
              <span className="font-bold">Schedule Site Visit</span>
              <span className="text-xs opacity-90">Plan customer assessments</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-3 border-thekedar-primary/30 text-thekedar-primary hover:bg-thekedar-primary hover:text-white transition-all duration-300 hover-scale rounded-xl">
              <Users className="h-6 w-6" />
              <span className="font-bold">Manage Team</span>
              <span className="text-xs opacity-90">Add/remove workers</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-3 border-thekedar-accent/30 text-thekedar-accent hover:bg-thekedar-accent hover:text-white transition-all duration-300 hover-scale rounded-xl">
              <DollarSign className="h-6 w-6" />
              <span className="font-bold">View Earnings</span>
              <span className="text-xs opacity-90">Track commissions</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-3 border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white transition-all duration-300 hover-scale rounded-xl" onClick={() => setShowChat(true)}>
              <MessageCircle className="h-6 w-6" />
              <span className="font-bold">Chat</span>
              <span className="text-xs opacity-90">Communicate with team</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Component - Conditionally rendered */}
      {showChat && (
        <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Team Chat</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <ChatComponent title="Team Chat" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedThekadarDashboard;