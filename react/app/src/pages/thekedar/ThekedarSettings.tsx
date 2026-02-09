import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, MapPin, DollarSign, Calendar, Shield } from 'lucide-react';

const ThekadarSettings = () => {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    autoAcceptJobs: false,
    workRadius: '10',
    currency: 'INR',
    weeklySchedule: {
      mon: { start: '09:00', end: '18:00', available: true },
      tue: { start: '09:00', end: '18:00', available: true },
      wed: { start: '09:00', end: '18:00', available: true },
      thu: { start: '09:00', end: '18:00', available: true },
      fri: { start: '09:00', end: '18:00', available: true },
      sat: { start: '09:00', end: '17:00', available: false },
      sun: { start: '', end: '', available: false },
    },
  });

  const handleSettingChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWeeklyScheduleChange = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day as keyof typeof prev.weeklySchedule],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    // Save settings logic would go here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary rounded-lg">
          <Settings className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Configure your basic account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work-radius">Work Radius (km)</Label>
                  <Select value={settings.workRadius} onValueChange={(value) => handleSettingChange('workRadius', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="15">15 km</SelectItem>
                      <SelectItem value="20">20 km</SelectItem>
                      <SelectItem value="25">25 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Auto-Accept New Jobs</Label>
                  <p className="text-sm text-muted-foreground">Automatically accept new job requests that match your criteria</p>
                </div>
                <Switch
                  checked={settings.autoAcceptJobs}
                  onCheckedChange={(checked) => handleSettingChange('autoAcceptJobs', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications for new jobs and updates</p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>Set your availability for each day of the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.weeklySchedule).map(([day, daySchedule]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-20 font-medium capitalize">{day}</div>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Available</Label>
                      <Switch
                        checked={daySchedule.available}
                        onCheckedChange={(checked) => handleWeeklyScheduleChange(day, 'available', checked)}
                      />
                    </div>
                    {daySchedule.available && (
                      <>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">From</Label>
                          <Input
                            type="time"
                            value={daySchedule.start}
                            onChange={(e) => handleWeeklyScheduleChange(day, 'start', e.target.value)}
                            disabled={!daySchedule.available}
                            className="w-24"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">To</Label>
                          <Input
                            type="time"
                            value={daySchedule.end}
                            onChange={(e) => handleWeeklyScheduleChange(day, 'end', e.target.value)}
                            disabled={!daySchedule.available}
                            className="w-24"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your account information and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2">
                <Shield className="h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <MapPin className="h-4 w-4" />
                Update Location
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Methods
              </Button>
              <Button variant="destructive" className="w-full">
                Deactivate Account
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save Changes</CardTitle>
              <CardDescription>Your settings will be applied immediately</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSave} className="w-full">
                Save All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThekadarSettings;