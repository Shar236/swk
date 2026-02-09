import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  Users, 
  MapPin, 
  CreditCard, 
  User, 
  LogOut,
  Briefcase,
  Calendar,
  DollarSign,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/thekedar/dashboard' },
  { id: 'map', label: 'Map', icon: MapPin, href: '/thekedar/map' },
  { id: 'site-visits', label: 'Site Visits', icon: MapPin, href: '/thekedar/site-visits' },
  { id: 'team', label: 'My Team', icon: Users, href: '/thekedar/team' },
  { id: 'projects', label: 'Projects', icon: Briefcase, href: '/thekedar/projects' },
  { id: 'earnings', label: 'Earnings', icon: DollarSign, href: '/thekedar/earnings' },
  { id: 'schedule', label: 'Schedule', icon: Calendar, href: '/thekedar/schedule' },
  { id: 'profile', label: 'Profile', icon: User, href: '/thekedar/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/thekedar/settings' },
];

const ThekedarLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-thekedar-primary to-thekedar-secondary">
      {/* Logo */}
      <div className="p-6 border-b border-thekedar-light/20">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white drop-shadow-sm">Thekedar Hub</h1>
            <p className="text-sm text-thekedar-light truncate opacity-90">
              {profile?.full_name || 'Team Leader'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]',
                    isActive 
                      ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                      : 'text-thekedar-light hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-thekedar-light/20">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 px-4 py-3 text-thekedar-light hover:text-white hover:bg-red-500/20 transition-all duration-300 group"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden fixed top-4 left-4 z-50 h-12 w-12 rounded-full bg-thekedar-primary/90 backdrop-blur-sm text-white shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-thekedar-primary to-thekedar-secondary">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b bg-white/70 backdrop-blur-md px-4 py-3 lg:px-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 animate-slide-in-left">
                <div className="h-3 w-3 rounded-full bg-thekedar-secondary animate-pulse"></div>
                <h1 className="text-xl font-bold text-gray-800">
                  {navItems.find(item => location.pathname.includes(item.id))?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-thekedar-light/30 px-3 py-1 rounded-full">
                <div className="h-2 w-2 rounded-full bg-thekedar-secondary animate-pulse"></div>
                <span className="font-medium">Business Online</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border-thekedar-primary/30 text-thekedar-primary hover:bg-thekedar-primary hover:text-white transition-all duration-300"
                asChild
              >
                <Link to="/thekedar/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 lg:px-6 animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThekedarLayout;
