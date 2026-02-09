import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Star,
  Edit,
  Save,
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ThekedarProfile = () => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: 'Sharma Construction',
    gstNumber: 'GSTIN1234567890',
    businessAddress: '123 Main Street, Industrial Area',
    businessCity: 'Delhi',
    businessPincode: '110001',
    establishedYear: '2018',
    aboutBusiness: 'We provide quality construction and renovation services with 10+ years of experience.',
    commissionRate: 5,
    serviceRadius: 15,
    totalProjects: 127,
    rating: 4.8,
    totalEarnings: 1250000
  });

  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    if (profile) {
      // Initialize with user data
      setFormData(prev => ({
        ...prev,
        businessName: profile.full_name ? `${profile.full_name}'s Business` : prev.businessName
      }));
    }
  }, [profile]);

  const handleSave = () => {
    // Validate required fields
    if (!formData.businessName || !formData.businessCity) {
      toast.error('Please fill all required fields');
      return;
    }

    setProfileData(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-emerald-600" }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your business information and settings
          </p>
        </div>
        
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="gap-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Your company details and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Business Name {isEditing && '*'}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      placeholder="Enter business name"
                    />
                  ) : (
                    <div className="text-lg font-medium">{profileData.businessName}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  {isEditing ? (
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                      placeholder="Enter GST number"
                    />
                  ) : (
                    <div>{profileData.gstNumber}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                {isEditing ? (
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                    placeholder="Enter full business address"
                    rows={3}
                  />
                ) : (
                  <div>{profileData.businessAddress}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessCity">
                    City {isEditing && '*'}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="businessCity"
                      value={formData.businessCity}
                      onChange={(e) => setFormData({...formData, businessCity: e.target.value})}
                      placeholder="City"
                    />
                  ) : (
                    <div>{profileData.businessCity}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessPincode">Pincode</Label>
                  {isEditing ? (
                    <Input
                      id="businessPincode"
                      value={formData.businessPincode}
                      onChange={(e) => setFormData({...formData, businessPincode: e.target.value})}
                      placeholder="Pincode"
                    />
                  ) : (
                    <div>{profileData.businessPincode}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  {isEditing ? (
                    <Input
                      id="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => setFormData({...formData, establishedYear: e.target.value})}
                      placeholder="2018"
                    />
                  ) : (
                    <div>{profileData.establishedYear}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutBusiness">About Your Business</Label>
                {isEditing ? (
                  <Textarea
                    id="aboutBusiness"
                    value={formData.aboutBusiness}
                    onChange={(e) => setFormData({...formData, aboutBusiness: e.target.value})}
                    placeholder="Tell customers about your business..."
                    rows={4}
                  />
                ) : (
                  <div className="text-muted-foreground">{profileData.aboutBusiness}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>
                Configure your service preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  {isEditing ? (
                    <Input
                      id="commissionRate"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({...formData, commissionRate: parseFloat(e.target.value) || 5})}
                    />
                  ) : (
                    <div className="text-lg font-medium">{profileData.commissionRate}%</div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Standard rate for team member commissions
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceRadius">Service Radius (km)</Label>
                  {isEditing ? (
                    <Input
                      id="serviceRadius"
                      type="number"
                      min="5"
                      max="50"
                      value={formData.serviceRadius}
                      onChange={(e) => setFormData({...formData, serviceRadius: parseInt(e.target.value) || 15})}
                    />
                  ) : (
                    <div className="text-lg font-medium">{profileData.serviceRadius} km</div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Maximum distance for site visits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-12 w-12 text-emerald-600" />
                </div>
                {isEditing && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute bottom-4 right-0 rounded-full h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h3 className="font-semibold text-lg">{profile?.full_name || 'Thekedar'}</h3>
              <p className="text-muted-foreground">Team Leader</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="space-y-4">
            <StatCard 
              title="Rating" 
              value={
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  {profileData.rating}
                </div>
              } 
              icon={Star} 
              color="text-yellow-500"
            />
            
            <StatCard 
              title="Total Projects" 
              value={profileData.totalProjects} 
              icon={Calendar} 
            />
            
            <StatCard 
              title="Total Earnings" 
              value={`₹${(profileData.totalEarnings / 100000).toFixed(1)}L`} 
              icon={Building2} 
            />
          </div>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{profile?.phone || '+91 9876543210'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{profile?.email || 'business@example.com'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{profileData.businessCity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThekedarProfile;