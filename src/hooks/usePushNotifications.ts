import { useEffect, useState } from 'react';
import { 
  requestPushPermission, 
  ensureDefaultChannel, 
  getFCMToken, 
  setupPushNotificationListeners,
  showLocalNotification,
  PushNotificationConfig 
} from '../push';

export function usePushNotifications() {
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {
      const permissionGranted = await requestPushPermission();
      setIsPermissionGranted(permissionGranted);

      if (permissionGranted) {
        await ensureDefaultChannel();
        const token = await getFCMToken();
        setFcmToken(token);
        setupPushNotificationListeners();
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      setIsInitialized(true);
    }
  };

  const sendLocalNotification = async (config: PushNotificationConfig) => {
    if (isPermissionGranted) {
      await showLocalNotification(config);
    }
  };

  return {
    isPermissionGranted,
    fcmToken,
    isInitialized,
    sendLocalNotification,
  };
}
