import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  team_size: number;
  location: string;
  created_at: string;
}

const ThekedarProjects = () => {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state for new project
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    start_date: '',
    end_date: '',
    budget: 0,
    location: '',
    team_size: 1
  });

  useEffect(() => {
    if (user && profile?.role === 'thekedar') {
      // Initialize with mock data since projects table doesn't exist
      setProjects([
        {
          id: '1',
          name: 'Home Renovation - Sector 22',
          description: 'Complete home renovation project for residential property',
          status: 'in_progress',
          start_date: '2024-01-15',
          end_date: '2024-03-15',
          budget: 500000,
          spent: 320000,
          team_size: 5,
          location: 'Sector 22, Gurgaon',
          created_at: '2024-01-10',
        },
        {
          id: '2',
          name: 'Office Setup - Cyber Hub',
          description: 'Setting up office infrastructure and furniture',
          status: 'completed',
          start_date: '2023-11-01',
          end_date: '2023-12-15',
          budget: 250000,
          spent: 250000,
          team_size: 3,
          location: 'Cyber Hub, Gurgaon',
          created_at: '2023-10-25',
        },
        {
          id: '3',
          name: 'Kitchen Remodeling',
          description: 'Complete kitchen remodeling with new fixtures',
          status: 'pending',
          start_date: '2024-02-01',
          end_date: '2024-03-01',
          budget: 150000,
          spent: 0,
          team_size: 2,
          location: 'DLF Phase 3, Gurgaon',
          created_at: '2024-01-20',
        }
      ]);
      setFilteredProjects([
        {
          id: '1',
          name: 'Home Renovation - Sector 22',
          description: 'Complete home renovation project for residential property',
          status: 'in_progress',
          start_date: '2024-01-15',
          end_date: '2024-03-15',
          budget: 500000,
          spent: 320000,
          team_size: 5,
          location: 'Sector 22, Gurgaon',
          created_at: '2024-01-10',
        },
        {
          id: '2',
          name: 'Office Setup - Cyber Hub',
          description: 'Setting up office infrastructure and furniture',
          status: 'completed',
          start_date: '2023-11-01',
          end_date: '2023-12-15',
          budget: 250000,
          spent: 250000,
          team_size: 3,
          location: 'Cyber Hub, Gurgaon',
          created_at: '2023-10-25',
        },
        {
          id: '3',
          name: 'Kitchen Remodeling',
          description: 'Complete kitchen remodeling with new fixtures',
          status: 'pending',
          start_date: '2024-02-01',
          end_date: '2024-03-01',
          budget: 150000,
          spent: 0,
          team_size: 2,
          location: 'DLF Phase 3, Gurgaon',
          created_at: '2024-01-20',
        }
      ]);
      setIsLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    // Filter projects based on search term
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  const handleCreateProject = () => {
    try {
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        ...formData,
        spent: 0,
        created_at: new Date().toISOString()
      };

      setProjects([...projects, newProject]);
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        status: 'pending',
        start_date: '',
        end_date: '',
        budget: 0,
        location: '',
        team_size: 1
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;

    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressPercentage = (budget: number, spent: number) => {
    if (budget === 0) return 0;
    return Math.min(100, (spent / budget) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your ongoing and completed projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add details for your new project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter project description"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                    placeholder="Enter budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team_size">Team Size</Label>
                  <Input
                    id="team_size"
                    type="number"
                    value={formData.team_size}
                    onChange={(e) => setFormData({...formData, team_size: Number(e.target.value)})}
                    placeholder="Number of team members"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter project location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value: 'pending' | 'in_progress' | 'completed' | 'cancelled') => 
                    setFormData({...formData, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first project to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{project.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {project.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{project.spent.toLocaleString()} / ₹{project.budget.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={getProgressPercentage(project.budget, project.spent)} 
                          className="w-24"
                        />
                        <span className="text-sm">
                          {Math.round(getProgressPercentage(project.budget, project.spent))}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{project.team_size} members</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update details for {editingProject.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Project Name</Label>
                <Input
                  id="edit-name"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  placeholder="Enter project description"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_date">Start Date</Label>
                  <Input
                    id="edit-start_date"
                    type="date"
                    value={editingProject.start_date.split('T')[0]}
                    onChange={(e) => setEditingProject({...editingProject, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end_date">End Date</Label>
                  <Input
                    id="edit-end_date"
                    type="date"
                    value={editingProject.end_date.split('T')[0]}
                    onChange={(e) => setEditingProject({...editingProject, end_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget (₹)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={editingProject.budget}
                    onChange={(e) => setEditingProject({...editingProject, budget: Number(e.target.value)})}
                    placeholder="Enter budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-team_size">Team Size</Label>
                  <Input
                    id="edit-team_size"
                    type="number"
                    value={editingProject.team_size}
                    onChange={(e) => setEditingProject({...editingProject, team_size: Number(e.target.value)})}
                    placeholder="Number of team members"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingProject.location}
                  onChange={(e) => setEditingProject({...editingProject, location: e.target.value})}
                  placeholder="Enter project location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingProject.status}
                  onValueChange={(value: 'pending' | 'in_progress' | 'completed' | 'cancelled') => 
                    setEditingProject({...editingProject, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateProject}>Update Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ThekedarProjects;