import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, IndianRupee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/db';

import { useNavigate } from 'react-router-dom';

const WorkerEarningsPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [earningsData, setEarningsData] = useState({
    today: 0,
    projectedToday: 0,
    weekly: 0,
    monthly: 0,
    total: 0,
    commissionRate: 0.15, // 15% commission
    insuranceFee: 0,
    platformFee: 0
  });
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'worker') {
      fetchEarningsData();
    }
  }, [user, profile]);

  const fetchEarningsData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch worker profile to get worker ID
      const { data: workerProfile, error: profileError } = await db
        .collection('worker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!workerProfile || profileError) {
        console.error('Error fetching worker profile:', profileError);
        setLoading(false);
        return;
      }

      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      
      // Fetch today's completed jobs
      const { data: todayJobs, error: todayError } = await db
        .collection('bookings')
        .select('total_price')
        .eq('worker_id', workerProfile.id)
        .eq('status', 'completed')
        .gte('updated_at', `${today}T00:00:00`)
        .lte('updated_at', `${today}T23:59:59`);

      if (todayError) {
        console.error('Error fetching today jobs:', todayError);
      }

      // Fetch weekly completed jobs
      const { data: weeklyJobs, error: weeklyError } = await db
        .collection('bookings')
        .select('total_price')
        .eq('worker_id', workerProfile.id)
        .eq('status', 'completed')
        .gte('updated_at', startOfWeek.toISOString());

      if (weeklyError) {
        console.error('Error fetching weekly jobs:', weeklyError);
      }

      // Fetch monthly completed jobs
      const { data: monthlyJobs, error: monthlyError } = await db
        .collection('bookings')
        .select('total_price')
        .eq('worker_id', workerProfile.id)
        .eq('status', 'completed')
        .gte('updated_at', startOfMonth.toISOString());

      if (monthlyError) {
        console.error('Error fetching monthly jobs:', monthlyError);
      }

      // Fetch all completed jobs for total earnings
      const { data: totalJobs, error: totalError } = await db
        .collection('bookings')
        .select('total_price')
        .eq('worker_id', workerProfile.id)
        .eq('status', 'completed');

      if (totalError) {
        console.error('Error fetching total jobs:', totalError);
      }

      // Calculate projected earnings for today (based on pending/in-progress jobs)
      const { data: projectedJobs, error: projectedError } = await db
        .collection('bookings')
        .select('total_price')
        .eq('worker_id', workerProfile.id)
        .in('status', ['pending', 'accepted', 'in_progress']);

      if (projectedError) {
        console.error('Error fetching projected jobs:', projectedError);
      }

      // Calculate earnings
      const todayEarnings = todayJobs?.reduce((sum: number, job: any) => sum + (job.total_price || 0), 0) || 0;
      const weeklyEarnings = weeklyJobs?.reduce((sum: number, job: any) => sum + (job.total_price || 0), 0) || 0;
      const monthlyEarnings = monthlyJobs?.reduce((sum: number, job: any) => sum + (job.total_price || 0), 0) || 0;
      const totalEarnings = totalJobs?.reduce((sum: number, job: any) => sum + (job.total_price || 0), 0) || 0;
      const projectedToday = projectedJobs?.reduce((sum: number, job: any) => sum + (job.total_price || 0), 0) || 0;

      // Calculate fees (assuming 15% commission and some insurance fee)
      const commission = totalEarnings * 0.15;
      const insuranceFee = totalEarnings * 0.02; // 2% insurance fee
      const platformFee = totalEarnings * 0.03; // 3% platform fee

      setEarningsData({
        today: todayEarnings,
        projectedToday: todayEarnings + projectedToday,
        weekly: weeklyEarnings,
        monthly: monthlyEarnings,
        total: totalEarnings,
        commissionRate: 0.15,
        insuranceFee,
        platformFee
      });

      // Fetch transactions (completed jobs)
      const { data: transactionData, error: transactionError } = await db
        .collection('bookings')
        .select(`
          id,
          total_price,
          status,
          updated_at,
          services (name)
        `)
        .eq('worker_id', workerProfile.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
      } else {
        setTransactions(transactionData || []);
      }

      // Fetch payout history
      const { data: payoutData, error: payoutError } = await db
        .collection('payouts')
        .select('*')
        .eq('worker_id', workerProfile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (payoutError) {
        console.error('Error fetching payouts:', payoutError);
      } else {
        setPayouts(payoutData || []);
      }
    } catch (error) {
      console.error('Error fetching earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNetEarnings = () => {
    const gross = earningsData.total;
    const commission = gross * earningsData.commissionRate;
    const insurance = earningsData.insuranceFee;
    const platform = earningsData.platformFee;
    return gross - commission - insurance - platform;
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'accepted':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Earnings</h1>
        <p className="text-gray-600">Track your income, commissions, and payment history</p>
      </div>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{earningsData.today.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Earned today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{earningsData.projectedToday.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Expected today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{earningsData.weekly.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{earningsData.monthly.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{earningsData.total.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Earnings Breakdown
              </CardTitle>
              <CardDescription>Detailed view of your earnings and deductions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Gross Earnings</span>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{earningsData.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-2">
                    <span>Platform Commission ({(earningsData.commissionRate * 100).toFixed(0)}%)</span>
                    <Badge variant="outline" className="text-xs">Fee</Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span>-{(earningsData.total * earningsData.commissionRate).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-2">
                    <span>Insurance Fee (2%)</span>
                    <Badge variant="outline" className="text-xs">Fee</Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span>-{earningsData.insuranceFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-2">
                    <span>Platform Fee (3%)</span>
                    <Badge variant="outline" className="text-xs">Fee</Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span>-{earningsData.platformFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 font-bold text-lg">
                  <span>Net Earnings</span>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span>{calculateNetEarnings().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Earnings Distribution</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(calculateNetEarnings() / earningsData.total) * 100 || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Net Earnings: {(calculateNetEarnings() / earningsData.total) * 100 || 0}%</span>
                  <span>Deductions: {((earningsData.total - calculateNetEarnings()) / earningsData.total) * 100 || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>Your financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Commission Rate</span>
                <span className="font-medium">{(earningsData.commissionRate * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Jobs Completed</span>
                <span className="font-medium">0</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Avg. Earning/Job</span>
                <span className="font-medium">
                  <IndianRupee className="h-3 w-3 inline" />
                  {earningsData.total > 0 ? (earningsData.total / 0).toFixed(2) : '0.00'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Best Day</span>
                <span className="font-medium">₹0.00</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Payment Pending</span>
                <span className="font-medium">
                  <IndianRupee className="h-3 w-3 inline" />
                  0.00
                </span>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => navigate('/payment?type=payout&amount=' + calculateNetEarnings())} 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Payouts Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your completed service payments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.services?.name || 'Service'}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransactionStatusColor(transaction.status)}>
                            {transaction.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-baseline gap-1 justify-end">
                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                            <span>{(transaction.total_price || 0).toFixed(2)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions yet</h3>
                  <p className="text-gray-500">You don't have any completed transactions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Your payment withdrawal history</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : payouts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          {new Date(payout.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{payout.description || 'Payout Request'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              payout.status === 'completed' ? 'default' : 
                              payout.status === 'pending' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {payout.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-baseline gap-1 justify-end">
                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                            <span>{payout.amount?.toFixed(2) || '0.00'}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No payouts yet</h3>
                  <p className="text-gray-500">You haven't initiated any payouts.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Trend</CardTitle>
                <CardDescription>Your earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart visualization would appear here
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">0%</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Customer Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">0.0</span>
                      <span className="text-sm text-gray-500">(0 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <span className="font-medium">0 min avg</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Repeat Customers</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">0%</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkerEarningsPage;