import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UseNotificationsResult {
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
  scheduleNotification: (title: string, body: string, delayMs: number) => number;
  cancelNotification: (id: number) => void;
}

const useNotifications = (): UseNotificationsResult => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async (): Promise<void> => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setHasPermission(permission === 'granted');
        
        if (permission === 'granted') {
          toast.success('Notification permission granted!');
        } else if (permission === 'denied') {
          toast.error('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        toast.error('Failed to request notification permissions');
      }
    } else {
      toast.error('Notifications are not supported in this browser');
    }
  };

  const scheduleNotification = (title: string, body: string, delayMs: number): number => {
    if (!hasPermission) return -1;
    
    const timerId = window.setTimeout(() => {
      try {
        new Notification(title, { body });
      } catch (error) {
        console.error('Error showing notification:', error);
        toast.error('Failed to show notification');
      }
    }, delayMs);
    
    return timerId;
  };

  const cancelNotification = (id: number): void => {
    if (id > 0) {
      window.clearTimeout(id);
    }
  };

  return {
    hasPermission,
    requestPermission,
    scheduleNotification,
    cancelNotification
  };
};

export default useNotifications;