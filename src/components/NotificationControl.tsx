import React from 'react';
import { Bell } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';

interface NotificationControlProps {
  hasConfig: boolean;
}

const NotificationControl: React.FC<NotificationControlProps> = ({ hasConfig }) => {
  const { hasPermission, requestPermission } = useNotifications();

  if (hasPermission || !hasConfig) return null;
  
  return (
    <div className="mt-4 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
      <div className="flex items-start">
        <Bell className="h-5 w-5 text-warning-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-warning-800 dark:text-warning-300">Enable Notifications</h4>
          <p className="text-xs text-warning-700 dark:text-warning-400 mt-1">
            Allow notifications to receive alerts before your lease expires.
          </p>
          <button
            onClick={requestPermission}
            className="mt-2 px-3 py-1 text-xs font-medium bg-warning-100 dark:bg-warning-800 text-warning-800 dark:text-warning-200 rounded hover:bg-warning-200 dark:hover:bg-warning-700 transition-colors"
          >
            Enable Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationControl;