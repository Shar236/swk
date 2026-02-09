import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { EnhancedHeroSection } from '@/components/home/EnhancedHeroSection';
import { EnhancedServiceGrid } from '@/components/home/EnhancedServiceGrid';
import { EnhancedHowItWorks } from '@/components/home/EnhancedHowItWorks';
import { EnhancedFeaturesSection } from '@/components/home/EnhancedFeaturesSection';
import { RoleSelection } from '@/components/home/RoleSelection';
import { DownloadApp } from '@/components/home/DownloadApp';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

export default function EnhancedIndex() {
  const { user } = useAuth();
  const { subscribeToUserBookings } = useNotifications();

  // Subscribe to user's bookings when logged in
  useEffect(() => {
    if (user) {
      subscribeToUserBookings();
    }
  }, [user, subscribeToUserBookings]);

  return (
    <Layout>
      <EnhancedHeroSection />
      <EnhancedServiceGrid />
      <EnhancedHowItWorks />
      <EnhancedFeaturesSection />
      {!user && <RoleSelection />}
      <DownloadApp />
    </Layout>
  );
}