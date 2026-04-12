import {getApp, getApps, initializeApp} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {notificationAPI} from './api';


// Use existing default Firebase app if one is already created, otherwise initialize.
const app = getApps().length ? getApp() : initializeApp();

// Ensure the app object is available for any direct Firebase calls.
export default app;

// Request permission for notifications
export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('🔔 Notification permission granted');
      return true;
    } else {
      console.log('🔔 Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return false;
  }
};

// Get FCM token
export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    console.log('🔔 FCM Token:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
};

// Register token with backend
export const registerTokenWithBackend = async (userId, token) => {
  if (!userId || !token) {
    console.error('❌ Missing userId or token for registration');
    return;
  }

  const result = await notificationAPI.registerToken(userId, token);
  if (result.success) {
    console.log('✅ FCM token registered with backend');
  } else {
    console.error('❌ Failed to register FCM token:', result.error);
  }
};

// Handle foreground messages
export const setupForegroundMessageHandler = () => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('🔔 Foreground message received:', remoteMessage);
    // You can show local notification here using notifee or similar
    // For now, just log it
  });

  return unsubscribe;
};

// Handle background messages (this should be in a separate file for RN CLI)
export const setupBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('🔔 Background message received:', remoteMessage);
  });
};
