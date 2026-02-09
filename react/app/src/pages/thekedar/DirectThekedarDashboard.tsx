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
  User,
  Phone
} from 'lucide-react';

const DirectThekedarDashboard = () => {
  const [stats, setStats] = useState({
    upcomingVisits: 12,
    activeProjects: 8,
    teamMembers: 15,
    totalEarnings: 245000,
    monthlyEarnings: 42500,
    commissionEarned: 18750,
    projectCompletionRate: 94
  });

  const [recentVisits] = useState([
    {
      id: 'SV001',
      customer: 'Rajesh Kumar',
      address: '123 MG Road, Delhi',
      date: '2024-01-29',
      status: 'pending',
      type: 'House Renovation'
    },
    {
      id: 'SV002',
      customer: 'Priya Sharma',
      address: '456 Sector 15, Noida',
      date: '2024-01-30',
      status: 'scheduled',
      type: 'Electrical Work'
    },
    {
      id: 'SV003',
      customer: 'Amit Patel',
      address: '789 East Street, Ghaziabad',
      date: '2024-01-28',
      status: 'completed',
      type: 'Plumbing'
    }
  ]);

  const [teamMembers] = useState([
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
  ]);

  const StatCard = ({ title, value, icon: Icon, change, color = "text-emerald-600" }: any) => (
    <Card className="hover:shadow-lg transition-shadow border-emerald-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
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
    <div className="min-h-screen bg-background p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-emerald-700 mb-2">
          Welcome to Thekedar Hub
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your construction business efficiently
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <Card className="border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between bg-emerald-50/50">
              <div>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <MapPin className="h-5 w-5" />
                  Recent Site Visits
                </CardTitle>
                <CardDescription>Upcoming and recent customer visits</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-emerald-200">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-emerald-50/50 transition-colors">
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
                        className={`${
                          visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                          visit.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
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
          <Card className="border-emerald-100">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <BarChart3 className="h-5 w-5" />
                Business Performance
              </CardTitle>
              <CardDescription>Monthly earnings and project trends</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-64 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Activity className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <p className="font-bold text-xl text-emerald-700">Performance Analytics</p>
                  <p className="text-muted-foreground mt-2">
                    Interactive chart showing your business growth over time
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-600">24%</p>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">94%</p>
                  <p className="text-sm text-muted-foreground">Completion</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">4.8★</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Overview */}
          <Card className="border-emerald-100">
            <CardHeader className="bg-emerald-50/50">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Users className="h-5 w-5" />
                My Team
              </CardTitle>
              <CardDescription>Top performing team members</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{member.rating}</span>
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
                <Button variant="outline" className="w-full border-emerald-200">
                  View All Team Members
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-emerald-100">
            <CardHeader className="bg-emerald-50/30">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Award className="h-5 w-5" />
                Business Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Top Performer</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Consistent Growth</p>
                  <p className="text-sm text-muted-foreground">12 months running</p>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Project Completion</span>
                  <span className="font-bold">{stats.projectCompletionRate}%</span>
                </div>
                <Progress value={stats.projectCompletionRate} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-emerald-100">
            <CardHeader className="bg-emerald-50/30">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Bell className="h-5 w-5" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm font-medium">New site visit request</p>
                  <p className="text-xs text-muted-foreground mt-1">Rajesh Kumar • 2 hours ago</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground mt-1">₹25,000 credited • 5 hours ago</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium">Team member completed training</p>
                  <p className="text-xs text-muted-foreground mt-1">Suresh Yadav • 1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Cards */}
      <Card className="mt-8 border-2 border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-emerald-100">
            Manage your business efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex flex-col items-center h-auto py-6 gap-2 bg-emerald-500 hover:bg-emerald-600">
              <MapPin className="h-6 w-6" />
              <span className="font-medium">Schedule Site Visit</span>
              <span className="text-xs opacity-90">Plan customer assessments</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-2 border-emerald-200">
              <Users className="h-6 w-6 text-emerald-600" />
              <span className="font-medium">Manage Team</span>
              <span className="text-xs text-muted-foreground">Add/remove workers</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-2 border-emerald-200">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              <span className="font-medium">View Earnings</span>
              <span className="text-xs text-muted-foreground">Track commissions</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center h-auto py-6 gap-2 border-emerald-200">
              <PieChart className="h-6 w-6 text-emerald-600" />
              <span className="font-medium">Business Analytics</span>
              <span className="text-xs text-muted-foreground">Performance insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectThekedarDashboard;