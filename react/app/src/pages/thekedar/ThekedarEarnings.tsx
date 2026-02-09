import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard,
  Download,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ThekedarEarnings = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [stats, setStats] = useState({
    totalEarnings: 0,
    commissionEarned: 0,
    pendingPayout: 0,
    completedProjects: 0
  });

  useEffect(() => {
    if (user && profile?.role === 'thekedar') {
      fetchEarningsData();
    }
  }, [user, profile, filterPeriod]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockEarnings = [
        {
          id: '1',
          projectId: 'PROJ001',
          projectName: 'House Renovation',
          customerName: 'Ramesh Patel',
          totalAmount: 25000,
          commissionRate: 0.05,
          commissionEarned: 1250,
          platformFee: 500,
          payoutStatus: 'paid',
          payoutDate: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          id: '2',
          projectId: 'PROJ002',
          projectName: 'Electrical Work',
          customerName: 'Sunita Sharma',
          totalAmount: 8500,
          commissionRate: 0.05,
          commissionEarned: 425,
          platformFee: 170,
          payoutStatus: 'processed',
          payoutDate: null,
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
        },
        {
          id: '3',
          projectId: 'PROJ003',
          projectName: 'Plumbing Installation',
          customerName: 'Vikram Singh',
          totalAmount: 12000,
          commissionRate: 0.05,
          commissionEarned: 600,
          platformFee: 240,
          payoutStatus: 'pending',
          payoutDate: null,
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
        }
      ];

      setEarnings(mockEarnings);
      
      // Calculate stats
      const total = mockEarnings.reduce((sum, e) => sum + e.totalAmount, 0);
      const commission = mockEarnings.reduce((sum, e) => sum + e.commissionEarned, 0);
      const pending = mockEarnings
        .filter(e => e.payoutStatus === 'pending')
        .reduce((sum, e) => sum + e.commissionEarned, 0);
      
      setStats({
        totalEarnings: total,
        commissionEarned: commission,
        pendingPayout: pending,
        completedProjects: mockEarnings.length
      });
      
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportEarnings = () => {
    toast.success('Exporting earnings report...');
    // Implementation for CSV export would go here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">
            Track your commissions and payouts
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          
          <Button onClick={exportEarnings} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button 
            onClick={() => navigate('/payment?type=payout&amount=' + stats.pendingPayout)} 
            className="bg-primary hover:bg-primary/90 text-white font-bold gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Withdraw to Bank
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total project value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.commissionEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Your earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pendingPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting transfer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">Completed projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
          <CardDescription>
            Detailed view of your commissions and payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Project</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                  <th className="text-right py-3 px-4 font-medium">Commission</th>
                  <th className="text-right py-3 px-4 font-medium">Platform Fee</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning) => (
                  <tr key={earning.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{earning.projectName}</div>
                        <div className="text-sm text-muted-foreground">{earning.projectId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{earning.customerName}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-medium">₹{earning.totalAmount.toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-medium text-emerald-600">
                        ₹{earning.commissionEarned.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {earning.commissionRate * 100}%
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-muted-foreground">
                        ₹{earning.platformFee.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getStatusColor(earning.payoutStatus)}>
                        {earning.payoutStatus.charAt(0).toUpperCase() + earning.payoutStatus.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                      {new Date(earning.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payout Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Commission Trends
            </CardTitle>
            <CardDescription>
              Your earning patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">This Month</span>
                <span className="font-medium">₹{Math.round(stats.commissionEarned * 0.7).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Month</span>
                <span className="font-medium">₹{Math.round(stats.commissionEarned * 0.5).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average per Project</span>
                <span className="font-medium">
                  ₹{stats.completedProjects > 0 ? Math.round(stats.commissionEarned / stats.completedProjects).toLocaleString() : '0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payout Information
            </CardTitle>
            <CardDescription>
              Your payment details and schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Payment Method</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="font-medium">UPI Transfer</div>
                  <div className="text-sm text-muted-foreground">****@upi</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Next Payout</h4>
                <div className="text-sm">
                  <div>₹{stats.pendingPayout.toLocaleString()} pending</div>
                  <div className="text-muted-foreground">Processed every Friday</div>
                </div>
              </div>
              
              <Button className="w-full">
                Update Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {earnings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No earnings yet</h3>
            <p className="text-muted-foreground">
              Complete projects to start earning commissions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThekedarEarnings;