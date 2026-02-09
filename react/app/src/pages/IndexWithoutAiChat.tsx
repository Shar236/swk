import { useEffect } from 'react';
import { Layout } from '@/components/layout/LayoutWithoutAiChat';
import { HeroSection } from '@/components/home/HeroSection';
import { ServiceGrid } from '@/components/home/ServiceGrid';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { RoleSelection } from '@/components/home/RoleSelection';
import { DownloadApp } from '@/components/home/DownloadApp';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

const Index = () => {
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
      <HeroSection />
      <ServiceGrid />
      <HowItWorks />
      <FeaturesSection />
      {!user && <RoleSelection />}
      <DownloadApp />
    </Layout>
  );
};

export default Index;