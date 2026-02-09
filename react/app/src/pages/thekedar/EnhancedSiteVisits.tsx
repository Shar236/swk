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
  Filter,
  Map,
  Phone,
  User,
  Star,
  Navigation,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EnhancedSiteVisits = () => {
  const { user, profile } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState<any>(null);

  // Mock data for site visits
  const mockVisits = [
    {
      id: 'SV001',
      customer: 'Rajesh Kumar',
      phone: '+91 9876543210',
      address: '123 MG Road, Delhi 110001',
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'pending',
      scheduledDate: '2024-01-30',
      workType: 'House Renovation',
      description: 'Complete house renovation including plumbing, electrical, and painting',
      teamSize: 3,
      estimatedDays: 15,
      estimatedCost: 250000,
      photos: []
    },
    {
      id: 'SV002',
      customer: 'Priya Sharma',
      phone: '+91 8765432109',
      address: '456 Sector 15, Noida 201301',
      latitude: 28.5355,
      longitude: 77.3910,
      status: 'scheduled',
      scheduledDate: '2024-01-29',
      workType: 'Electrical Work',
      description: 'Wiring and electrical fixture installation',
      teamSize: 2,
      estimatedDays: 5,
      estimatedCost: 45000,
      photos: []
    },
    {
      id: 'SV003',
      customer: 'Amit Patel',
      phone: '+91 7654321098',
      address: '789 East Street, Ghaziabad 201001',
      latitude: 28.6692,
      longitude: 77.4538,
      status: 'completed',
      scheduledDate: '2024-01-25',
      workType: 'Plumbing',
      description: 'Kitchen and bathroom plumbing work',
      teamSize: 2,
      estimatedDays: 7,
      estimatedCost: 32000,
      photos: ['photo1.jpg', 'photo2.jpg']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVisits(mockVisits);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateVisit = () => {
    toast.success('Site visit created successfully!');
    setShowCreateForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.workType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const MapComponent = () => (
    <div className="bg-muted h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Delhi NCR Region</span>
          </div>
        </div>
        
        {/* Mock map markers */}
        {filteredVisits.map((visit, index) => (
          <div 
            key={visit.id}
            className={`absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform ${
              visit.status === 'completed' ? 'bg-green-500' :
              visit.status === 'scheduled' ? 'bg-blue-500' :
              'bg-yellow-500'
            }`}
            style={{
              left: `${20 + index * 25}%`,
              top: `${30 + (index % 2) * 30}%`
            }}
            title={`${visit.customer} - ${visit.status}`}
          />
        ))}
      </div>
      <div className="text-center z-10">
        <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Interactive Map View</p>
        <p className="text-xs text-muted-foreground mt-1">Showing {filteredVisits.length} site visits</p>
      </div>
    </div>
  );

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
            Manage and track your customer site visits
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Site Visit
          </Button>
          <Button variant="outline" className="gap-2">
            <Map className="h-4 w-4" />
            Map View
          </Button>
        </div>
      </div>

      {/* Map Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Site Visit Locations
          </CardTitle>
          <CardDescription>
            Geographic overview of your upcoming visits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MapComponent />
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Pending ({visits.filter(v => v.status === 'pending').length})
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Scheduled ({visits.filter(v => v.status === 'scheduled').length})
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Completed ({visits.filter(v => v.status === 'completed').length})
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, address, or work type..."
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVisits.map((visit) => (
          <Card key={visit.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>Visit #{visit.id}</span>
                    <Badge className={getStatusColor(visit.status)}>
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {visit.customer}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedVisit(visit)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{visit.address}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{visit.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(visit.scheduledDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium text-emerald-700">{visit.workType}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {visit.description}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">{visit.teamSize}</p>
                  <p className="text-xs text-muted-foreground">People</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{visit.estimatedDays}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">₹{visit.estimatedCost.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Estimate</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Navigation className="h-3 w-3 mr-1" />
                  Navigate
                </Button>
                <Button size="sm" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
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
              <CardTitle>Schedule New Site Visit</CardTitle>
              <CardDescription>
                Plan a customer site assessment
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input id="customerName" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input id="customerPhone" placeholder="+91 9876543210" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Site Address *</Label>
                <Textarea 
                  id="address" 
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workType">Work Type</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>House Renovation</option>
                    <option>Electrical Work</option>
                    <option>Plumbing</option>
                    <option>Carpentry</option>
                    <option>Painting</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Preferred Date</Label>
                  <Input id="scheduledDate" type="date" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Work Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the work to be assessed..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input id="teamSize" type="number" min="1" defaultValue="2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedDays">Est. Duration (days)</Label>
                  <Input id="estimatedDays" type="number" min="1" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Est. Cost (₹)</Label>
                  <Input id="estimatedCost" type="number" placeholder="50000" />
                </div>
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

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Visit Details - {selectedVisit.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="font-medium">{selectedVisit.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p>{selectedVisit.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p>{selectedVisit.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(selectedVisit.status)}>
                    {selectedVisit.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Work Type</p>
                  <p className="font-medium text-emerald-600">{selectedVisit.workType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-muted-foreground">{selectedVisit.description}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedVisit(null)}>
                  Close
                </Button>
                <Button>
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedSiteVisits;