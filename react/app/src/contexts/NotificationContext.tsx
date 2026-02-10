import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Realtime (Supabase) removed; using local in-memory notifications for now
// For production integrate websockets or server-sent events

import { db } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'booking_update' | 'worker_arrival' | 'otp_alert' | 'job_completion' | 'payment_received';
  title: string;
  message: string;
  bookingId?: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  subscribeToBooking: (bookingId: string) => void;
  subscribeToUserBookings: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user && !initialized) {
      const saved = localStorage.getItem(`rahi-notifications-${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setNotifications(parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          })));
        } catch (e) {
          console.error('Failed to parse saved notifications', e);
        }
      }
      setInitialized(true);
    }
  }, [user, initialized]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user && initialized) {
      localStorage.setItem(`rahi-notifications-${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user, initialized]);

  // Add a new notification
  const addNotification = React.useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast(notification.title, {
      description: notification.message,
      duration: 5000,
    });

    // Optional: Play sound notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new window.Notification(notification.title, { body: notification.message });
      } catch (e) {
        console.warn('Browser notification failed', e);
      }
    }
  }, []);

  // Mark a notification as read
  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearNotifications = React.useCallback(() => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`rahi-notifications-${user.id}`);
    }
  }, [user]);

  // Subscribe to a specific booking
  const subscribeToBooking = React.useCallback((bookingId: string) => {
    // Realtime not implemented in this migration. Placeholder for future websocket/SSE implementation.
    console.warn('subscribeToBooking is not implemented yet (no realtime).');
    return () => {};
  }, [user, language]);

  // Subscribe to all user's bookings
  const subscribeToUserBookings = React.useCallback(() => {
    // Realtime not implemented in this migration. Placeholder for future websocket/SSE implementation.
    console.warn('subscribeToUserBookings is not implemented yet (no realtime).');
    return () => {};
  }, [user, profile, language, addNotification]);

  // Handle booking status changes
  const handleBookingStatusChange = (booking: any, oldStatus: string | null, newStatus: string) => {
    const serviceNames: Record<string, string> = {
      'Plumber': language === 'hi' ? 'प्लंबर' : 'Plumber',
      'Electrician': language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electrician',
      'Carpenter': language === 'hi' ? 'बढ़ई' : 'Carpenter',
      'Painter': language === 'hi' ? 'पेंटर' : 'Painter',
      'Tiles Installer': language === 'hi' ? 'टाइल्स मिस्त्री' : 'Tiles Installer',
      'Appliance Repair': language === 'hi' ? 'उपकरण मरम्मत' : 'Appliance Repair',
      'Construction Mazdoor': language === 'hi' ? 'निर्माण मजदूर' : 'Construction Labor',
      'Tent House': language === 'hi' ? 'टेंट हाउस' : 'Tent House',
      'Cleaning': language === 'hi' ? 'सफाई' : 'Cleaning',
      'AC Service': language === 'hi' ? 'एसी सर्विस' : 'AC Service',
    };

    const serviceName = serviceNames[booking.category_id] || 'Service';

    switch (newStatus) {
      case 'matched':
        addNotification({
          type: 'booking_update',
          title: language === 'hi' ? 'कारीगर मिल गया!' : 'Worker Found!',
          message: language === 'hi'
            ? `${serviceName} कारीगर आपके लिए तैयार हैं`
            : `${serviceName} worker is ready for you`,
          bookingId: booking.id,
          data: booking,
        });
        break;

      case 'accepted':
        addNotification({
          type: 'booking_update',
          title: language === 'hi' ? 'कारीगर ने स्वीकार किया' : 'Worker Accepted',
          message: language === 'hi'
            ? `${serviceName} कारीगर आपके काम को स्वीकार कर चुके हैं`
            : `${serviceName} worker has accepted your job`,
          bookingId: booking.id,
          data: booking,
        });
        break;

      case 'in_progress':
        addNotification({
          type: 'worker_arrival',
          title: language === 'hi' ? 'काम शुरू हुआ!' : 'Work Started!',
          message: language === 'hi'
            ? `${serviceName} कारीगर काम शुरू कर चुके हैं`
            : `${serviceName} worker has started the work`,
          bookingId: booking.id,
          data: booking,
        });
        break;

      case 'completed':
        addNotification({
          type: 'job_completion',
          title: language === 'hi' ? 'काम पूरा हुआ!' : 'Work Completed!',
          message: language === 'hi'
            ? `${serviceName} कारीगर ने काम पूरा कर दिया है`
            : `${serviceName} worker has completed the work`,
          bookingId: booking.id,
          data: booking,
        });
        break;

      case 'cancelled':
        addNotification({
          type: 'booking_update',
          title: language === 'hi' ? 'बुकिंग रद्द' : 'Booking Cancelled',
          message: language === 'hi'
            ? `${serviceName} की बुकिंग रद्द कर दी गई है`
            : `${serviceName} booking has been cancelled`,
          bookingId: booking.id,
          data: booking,
        });
        break;
    }

    // OTP alerts
    if (booking.otp_start && newStatus === 'accepted') {
      addNotification({
        type: 'otp_alert',
        title: language === 'hi' ? 'OTP तैयार है' : 'OTP Ready',
        message: language === 'hi'
          ? `कारीगर के साथ शेयर करने के लिए OTP: ${booking.otp_start}`
          : `OTP to share with worker: ${booking.otp_start}`,
        bookingId: booking.id,
        data: { otp: booking.otp_start },
      });
    }
  };

  // Clean up subscriptions on unmount
  useEffect(() => {
    // Realtime channel removing not implemented
    return () => {};
  }, [channels]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        addNotification,
        subscribeToBooking,
        subscribeToUserBookings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}