import { useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
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
  const hasSubscribed = useRef(false);

  // Subscribe to user's bookings when logged in - but only once
  useEffect(() => {
    if (user && !hasSubscribed.current) {
      try {
        subscribeToUserBookings();
        hasSubscribed.current = true;
      } catch (error) {
        console.warn('Failed to subscribe to user bookings:', error);
      }
    }
  }, [user]); // Removed subscribeToUserBookings from dependencies to prevent infinite loop

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