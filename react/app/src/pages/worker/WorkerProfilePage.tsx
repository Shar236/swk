import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, MapPin, Phone, Mail, Calendar, IndianRupee, ShieldCheck, Clock, Edit3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const WorkerProfilePage = () => {
  const { user, profile } = useAuth();
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    bio: '',
    experience_years: 0,
    base_price: 0,
    address: '',
    city: '',
    state: '',
    status: 'online'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'worker') {
      fetchWorkerProfile();
    }
  }, [user, profile]);

  const fetchWorkerProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch worker profile
      const { data: workerData, error: workerError } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (workerError) {
        console.error('Error fetching worker profile:', workerError);
      } else if (workerData) {
        setWorkerProfile(workerData);
        setFormData({
          full_name: profile?.full_name || '',
          phone: profile?.phone || '',
          email: profile?.email || '',
          bio: workerData.bio || '',
          experience_years: workerData.experience_years || 0,
          base_price: workerData.base_price || 0,
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          status: workerData.status || 'online'
        });
      }
    } catch (error) {
      console.error('Error fetching worker profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return;
      }

      // Update worker profile in worker_profiles table
      const { error: workerProfileError } = await supabase
        .from('worker_profiles')
        .update({
          bio: formData.bio,
          experience_years: formData.experience_years,
          base_price: formData.base_price,
          status: formData.status
        })
        .eq('user_id', user.id);

      if (workerProfileError) {
        console.error('Error updating worker profile:', workerProfileError);
        return;
      }

      // Refresh the profile data
      fetchWorkerProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal and professional information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) || 'W'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl mt-2">{formData.full_name || profile?.full_name || 'Worker'}</CardTitle>
              <CardDescription>
                ID: {user?.id?.substring(0, 8) || 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    {workerProfile?.verification_status === 'verified' ? 'Verified Worker' : 'Unverified Worker'}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline">
                    {workerProfile?.status === 'online' ? 'Online' : 
                     workerProfile?.status === 'offline' ? 'Offline' : 'Busy'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-medium">{formData.experience_years} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Price</span>
                  <span className="font-medium">₹{formData.base_price}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="font-medium">4.8 ★</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Jobs Completed</span>
                  <span className="font-medium">128</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Personal Information
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} size="sm">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} size="sm">
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Update your personal and professional details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted">
                      {formData.full_name || profile?.full_name || 'Not set'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {formData.phone || profile?.phone || 'Not set'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {formData.email || profile?.email || 'Not set'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Availability Status</Label>
                  {isEditing ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 border rounded-md bg-muted">
                      {workerProfile?.status === 'online' ? 'Online' : 
                       workerProfile?.status === 'offline' ? 'Offline' : 'Busy'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
                      placeholder="Enter years of experience"
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formData.experience_years} years
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base_price">Hourly Rate (₹)</Label>
                  {isEditing ? (
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="base_price"
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value))}
                        placeholder="Enter your hourly rate"
                        className="pl-8"
                      />
                    </div>
                  ) : (
                    <div className="p-2 border rounded-md bg-muted flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      ₹{formData.base_price}/hr
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself and your expertise"
                      rows={4}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted min-h-[100px]">
                      {formData.bio || 'No bio set'}
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address"
                      rows={2}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      {formData.address || profile?.address || 'Not set'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter your city"
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted">
                        {formData.city || profile?.city || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter your state"
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted">
                        {formData.state || profile?.state || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your verification status and required documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                  <span className="font-medium">Aadhaar</span>
                  <Badge variant="default" className="mt-2">
                    {workerProfile?.aadhaar_verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                  <span className="font-medium">PAN Card</span>
                  <Badge variant="secondary" className="mt-2">
                    {workerProfile?.pan_verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                  <span className="font-medium">Skills</span>
                  <Badge variant="default" className="mt-2">
                    {workerProfile?.skills_verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">
                  Update Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfilePage;