import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Request permission for notifications
export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  return enabled;
};

// Get FCM token
export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Handle foreground messages
export const setupForegroundMessageHandler = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

    const notification = remoteMessage.notification;
    const title = notification?.title || 'New message';
    const body = notification?.body || JSON.stringify(remoteMessage.data || {});

    Alert.alert(title, body, [{ text: 'OK' }], { cancelable: true });
  });
};

// Handle background messages (this should be in index.js for RN)
export const setupBackgroundNotificationHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
};