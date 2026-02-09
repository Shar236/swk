import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Camera, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ThekedarSiteVisits = () => {
  const { user, profile } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newVisit, setNewVisit] = useState({
    customerId: '',
    sitePhotos: [] as string[],
    workDescription: '',
    materialsRequired: false,
    peopleNeeded: 1,
    estimatedDays: 1,
    estimatedCost: 0,
    visitNotes: ''
  });

  useEffect(() => {
    if (user && profile?.role === 'thekedar') {
      fetchSiteVisits();
    }
  }, [user, profile]);

  const fetchSiteVisits = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_visits')
        .select(`
          *,
          bookings!inner(*),
          profiles!inner(full_name, phone)
        `)
        .eq('thekedar_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching site visits:', error);
      toast.error('Failed to load site visits');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVisit = async () => {
    if (!user || !newVisit.customerId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_visits')
        .insert({
          thekedar_id: user.id,
          customer_id: newVisit.customerId,
          site_photos: newVisit.sitePhotos,
          work_description: newVisit.workDescription,
          materials_required: newVisit.materialsRequired,
          people_needed: newVisit.peopleNeeded,
          estimated_days: newVisit.estimatedDays,
          estimated_cost: newVisit.estimatedCost,
          visit_notes: newVisit.visitNotes,
          status: 'pending'
        })
        .select();

      if (error) throw error;
      
      toast.success('Site visit created successfully');
      setShowCreateForm(false);
      setNewVisit({
        customerId: '',
        sitePhotos: [],
        workDescription: '',
        materialsRequired: false,
        peopleNeeded: 1,
        estimatedDays: 1,
        estimatedCost: 0,
        visitNotes: ''
      });
      fetchSiteVisits();
    } catch (error) {
      console.error('Error creating site visit:', error);
      toast.error('Failed to create site visit');
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.bookings?.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-foreground">Site Visits</h1>
          <p className="text-muted-foreground mt-1">
            Manage your upcoming and completed site visits
          </p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Site Visit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Visits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisits.map((visit) => (
          <Card key={visit.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Visit #{visit.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {visit.profiles?.full_name || 'Customer'}
                  </p>
                </div>
                <Badge 
                  variant={
                    visit.status === 'completed' ? 'default' :
                    visit.status === 'pending' ? 'secondary' :
                    visit.status === 'scheduled' ? 'outline' :
                    'destructive'
                  }
                >
                  {visit.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{visit.bookings?.address || 'Address not available'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{visit.people_needed || 1} people needed</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Est. {visit.estimated_days || 1} days</span>
              </div>
              
              {visit.estimated_cost > 0 && (
                <div className="text-lg font-semibold text-emerald-600">
                  ₹{visit.estimated_cost.toLocaleString()}
                </div>
              )}
              
              <div className="pt-2">
                <Button variant="outline" className="w-full text-sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVisits.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No site visits found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first site visit to get started'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Site Visit
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Site Visit Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Create New Site Visit</CardTitle>
              <CardDescription>
                Schedule a visit to assess customer requirements
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID *</Label>
                <Input
                  id="customerId"
                  placeholder="Enter customer ID"
                  value={newVisit.customerId}
                  onChange={(e) => setNewVisit({...newVisit, customerId: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workDescription">Work Description *</Label>
                <Textarea
                  id="workDescription"
                  placeholder="Describe the work to be done..."
                  rows={3}
                  value={newVisit.workDescription}
                  onChange={(e) => setNewVisit({...newVisit, workDescription: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peopleNeeded">People Needed</Label>
                  <Input
                    id="peopleNeeded"
                    type="number"
                    min="1"
                    value={newVisit.peopleNeeded}
                    onChange={(e) => setNewVisit({...newVisit, peopleNeeded: parseInt(e.target.value) || 1})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDays">Estimated Days</Label>
                  <Input
                    id="estimatedDays"
                    type="number"
                    min="1"
                    value={newVisit.estimatedDays}
                    onChange={(e) => setNewVisit({...newVisit, estimatedDays: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost (₹)</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  value={newVisit.estimatedCost}
                  onChange={(e) => setNewVisit({...newVisit, estimatedCost: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="materialsRequired"
                  checked={newVisit.materialsRequired}
                  onChange={(e) => setNewVisit({...newVisit, materialsRequired: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="materialsRequired">Materials Required</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visitNotes">Additional Notes</Label>
                <Textarea
                  id="visitNotes"
                  placeholder="Any additional information..."
                  rows={2}
                  value={newVisit.visitNotes}
                  onChange={(e) => setNewVisit({...newVisit, visitNotes: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateVisit}>
                  Create Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ThekedarSiteVisits;