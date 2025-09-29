import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export interface PushNotificationConfig {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function requestPushPermission(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Error requesting push permission:', error);
    return false;
  }
}

export async function ensureDefaultChannel(): Promise<void> {
  try {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      description: 'Default channel for notifications',
      importance: AndroidImportance.DEFAULT,
    });
  } catch (error) {
    console.error('Error creating notification channel:', error);
  }
}

export async function getFCMToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export async function showLocalNotification(config: PushNotificationConfig): Promise<void> {
  try {
    await notifee.displayNotification({
      title: config.title,
      body: config.body,
      data: config.data,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.error('Error showing local notification:', error);
  }
}

export function setupPushNotificationListeners(): void {
  messaging().onMessage(async (remoteMessage) => {
    
    await showLocalNotification({
      title: remoteMessage.notification?.title || 'New Message',
      body: remoteMessage.notification?.body || 'You have a new notification',
      data: remoteMessage.data,
    });
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  });
}


