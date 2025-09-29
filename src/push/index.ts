import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export async function requestPushPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function ensureDefaultChannel(): Promise<void> {
  await notifee.createChannel({
    id: 'default',
    name: 'Default',
    importance: AndroidImportance.DEFAULT,
  });
}


