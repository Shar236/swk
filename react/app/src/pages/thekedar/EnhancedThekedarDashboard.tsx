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
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const EnhancedThekedarDashboard = () => {
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

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, color = "text-emerald-600" }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name || 'Thekedar'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          color="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Site Visits */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Recent Site Visits
                </CardTitle>
                <CardDescription>Upcoming and recent customer visits</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${
                        visit.status === 'completed' ? 'bg-green-500' :
                        visit.status === 'scheduled' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div>
                        <h3 className="font-medium">{visit.customer}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {visit.address}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{visit.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          visit.status === 'completed' ? 'default' :
                          visit.status === 'scheduled' ? 'outline' :
                          'secondary'
                        }
                      >
                        {visit.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(visit.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Business Performance
              </CardTitle>
              <CardDescription>Monthly earnings and project trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-medium text-emerald-700">Performance Chart</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Interactive chart showing your business growth
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">24%</p>
                  <p className="text-xs text-muted-foreground">Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">94%</p>
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">4.8★</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Team
              </CardTitle>
              <CardDescription>Top performing team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{member.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{member.projects} projects</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {member.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Team Members
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievement Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Top Performer</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Consistent Growth</p>
                  <p className="text-xs text-muted-foreground">12 months running</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Progress value={stats.projectCompletionRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {stats.projectCompletionRate}% project completion rate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      <Badge variant="secondary" className="text-xs">
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your business efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex flex-col items-center h-auto py-6 gap-2">
              <MapPin className="h-6 w-6" />
              <span className="font-medium">Schedule Site Visit</span>
              <span className="text-xs opacity-80">Plan customer assessments</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-2">
              <Users className="h-6 w-6" />
              <span className="font-medium">Manage Team</span>
              <span className="text-xs opacity-80">Add/remove workers</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="font-medium">View Earnings</span>
              <span className="text-xs opacity-80">Track commissions</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-2">
              <PieChart className="h-6 w-6" />
              <span className="font-medium">Analytics</span>
              <span className="text-xs opacity-80">Business insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedThekedarDashboard;