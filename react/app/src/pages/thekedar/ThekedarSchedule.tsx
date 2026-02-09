import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ThekadarSchedule = () => {
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: '1',
      title: 'Site Visit - Rajesh Kumar',
      date: '2024-01-29',
      time: '10:00 AM',
      location: '123 MG Road, Delhi',
      type: 'inspection',
      status: 'accepted',
      assignedTo: 'Ramesh Gupta'
    },
    {
      id: '2',
      title: 'Electrical Work - Priya Sharma',
      date: '2024-01-30',
      time: '2:00 PM',
      location: '456 Sector 15, Noida',
      type: 'service',
      status: 'pending',
      assignedTo: 'Suresh Yadav'
    },
    {
      id: '3',
      title: 'Plumbing - Amit Patel',
      date: '2024-01-28',
      time: '11:30 AM',
      location: '789 East Street, Ghaziabad',
      type: 'repair',
      status: 'completed',
      assignedTo: 'Mahesh Singh'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'service',
    assignedTo: ''
  });

  const handleAddSchedule = () => {
    if (!newScheduleItem.title || !newScheduleItem.date || !newScheduleItem.time) {
      return;
    }

    const newItem = {
      ...newScheduleItem,
      id: (scheduleItems.length + 1).toString(),
      status: 'pending' as const
    };

    setScheduleItems([...scheduleItems, newItem]);
    setNewScheduleItem({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'service',
      assignedTo: ''
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'inspection':
        return 'bg-purple-100 text-purple-800';
      case 'service':
        return 'bg-orange-100 text-orange-800';
      case 'repair':
        return 'bg-red-100 text-red-800';
      case 'installation':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team's appointments and site visits
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Schedule Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newScheduleItem.title}
                  onChange={(e) => setNewScheduleItem({...newScheduleItem, title: e.target.value})}
                  placeholder="Enter schedule title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newScheduleItem.date}
                    onChange={(e) => setNewScheduleItem({...newScheduleItem, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newScheduleItem.time}
                    onChange={(e) => setNewScheduleItem({...newScheduleItem, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newScheduleItem.location}
                  onChange={(e) => setNewScheduleItem({...newScheduleItem, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newScheduleItem.type} onValueChange={(value) => setNewScheduleItem({...newScheduleItem, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={newScheduleItem.assignedTo}
                    onChange={(e) => setNewScheduleItem({...newScheduleItem, assignedTo: e.target.value})}
                    placeholder="Assign to team member"
                  />
                </div>
              </div>
              <Button onClick={handleAddSchedule} className="w-full">
                Add Schedule Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Schedule
              </CardTitle>
              <CardDescription>Your team's upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {scheduleItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{item.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className={getTypeColor(item.type)}>
                              {item.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">Assigned to: {item.assignedTo}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Summary</CardTitle>
              <CardDescription>Overview of your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Appointments</span>
                  <Badge variant="outline">{scheduleItems.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending</span>
                  <Badge variant="secondary">
                    {scheduleItems.filter(item => item.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Confirmed</span>
                  <Badge variant="outline">
                    {scheduleItems.filter(item => item.status === 'accepted').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed</span>
                  <Badge variant="default">
                    {scheduleItems.filter(item => item.status === 'completed').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleItems
                  .filter(item => item.date === new Date().toISOString().split('T')[0])
                  .map(item => (
                    <div key={item.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-sm">{item.time}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{item.location}</div>
                    </div>
                  ))}
                {scheduleItems.filter(item => item.date === new Date().toISOString().split('T')[0]).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No appointments today</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateString = date.toISOString().split('T')[0];
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNumber = date.getDate();
                  
                  const dailyCount = scheduleItems.filter(item => item.date === dateString).length;
                  
                  return (
                    <div key={dateString} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{dayName}</span>
                        <span className="text-xs text-muted-foreground">{dayNumber}</span>
                      </div>
                      <Badge variant="outline" className="rounded-full">
                        {dailyCount}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThekadarSchedule;