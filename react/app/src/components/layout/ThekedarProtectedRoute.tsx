import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ThekedarProtectedRouteProps {
  children?: React.ReactNode;
}

const ThekedarProtectedRoute: React.FC<ThekedarProtectedRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no profile, redirect to login to complete registration
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // If user is not a thekedar, redirect to appropriate page
  if (profile.role !== 'thekedar') {
    // Redirect based on role
    if (profile.role === 'worker') {
      return <Navigate to="/worker/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ThekedarProtectedRoute;