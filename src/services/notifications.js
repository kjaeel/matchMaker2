import { getApp } from '@react-native-firebase/app';
import { getMessaging, AuthorizationStatus } from '@react-native-firebase/messaging';
import { getFirestore, FieldValue } from '@react-native-firebase/firestore';
import { logEvent } from './firebase';
import { Platform } from 'react-native';

// Request notification permissions
export const requestNotificationPermission = async () => {
  try {
    // Ensure Firebase app is initialized
    const app = getApp();
    const messagingInstance = getMessaging(app);
    
    // Call methods directly without storing references to avoid deprecation warnings
    const authStatus = await messagingInstance.requestPermission();
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted');
      // Get FCM token - call directly
      const token = await messagingInstance.getToken();
      console.log('FCM Token:', token);
      
      // Log analytics
      await logEvent('notification_permission_granted', { token: token.substring(0, 10) });
      
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error requesting notification permission (Firebase may not be configured):', error);
    return null;
  }
};

// Handle foreground messages
export const setupForegroundMessageHandler = () => {
  try {
    // Ensure Firebase app is initialized
    const app = getApp();
    const messagingInstance = getMessaging(app);
    // Call method directly without storing reference
    return messagingInstance.onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      
      // Log analytics
      await logEvent('notification_received_foreground', {
        messageId: remoteMessage.messageId,
        notification: remoteMessage.notification?.title || 'No title',
      });
      
      // You can show a local notification here if needed
      // For now, the app will handle it through Firestore listeners
    });
  } catch (error) {
    console.error('Error setting up foreground message handler (Firebase may not be configured):', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Handle background messages (Android)
export const setupBackgroundMessageHandler = async (remoteMessage) => {
  console.log('Background message received:', remoteMessage);
  
  // Log analytics
  await logEvent('notification_received_background', {
    messageId: remoteMessage.messageId,
    notification: remoteMessage.notification?.title || 'No title',
  });
};

// Handle notification taps
export const setupNotificationOpenedHandler = (navigationRef) => {
  try {
    // Ensure Firebase app is initialized
    const app = getApp();
    const messagingInstance = getMessaging(app);
    // Call method directly without storing reference
    return messagingInstance.onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      
      // Log analytics
      logEvent('notification_opened', {
        messageId: remoteMessage.messageId,
        data: remoteMessage.data,
      });
      
      // Navigate to chat if data contains chatId
      if (remoteMessage.data?.chatId && navigationRef) {
        navigationRef.navigate('IndividualChat', {
          chatId: remoteMessage.data.chatId,
          otherUserId: remoteMessage.data.otherUserId,
          otherUserName: remoteMessage.data.otherUserName || 'Chat',
        });
      }
    });
  } catch (error) {
    console.error('Error setting up notification opened handler (Firebase may not be configured):', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Check if app was opened from a notification
export const checkInitialNotification = async (navigationRef) => {
  try {
    // Ensure Firebase app is initialized
    const app = getApp();
    const messagingInstance = getMessaging(app);
    // Call method directly without storing reference
    const remoteMessage = await messagingInstance.getInitialNotification();
    
    if (remoteMessage) {
      console.log('App opened from notification:', remoteMessage);
      
      // Log analytics
      await logEvent('notification_opened_app', {
        messageId: remoteMessage.messageId,
        data: remoteMessage.data,
      });
      
      // Navigate to chat if data contains chatId
      if (remoteMessage.data?.chatId && navigationRef) {
        setTimeout(() => {
          navigationRef.navigate('IndividualChat', {
            chatId: remoteMessage.data.chatId,
            otherUserId: remoteMessage.data.otherUserId,
            otherUserName: remoteMessage.data.otherUserName || 'Chat',
          });
        }, 1000);
      }
    }
  } catch (error) {
    console.error('Error checking initial notification (Firebase may not be configured):', error);
  }
};

// Save FCM token to user's document in Firestore
export const saveFCMToken = async (userId, token) => {
  try {
    const { getDbService } = require('./firebase');
    const dbInstance = getDbService();
    const usersCollection = dbInstance.collection('users');
    await usersCollection.doc(userId).update({
      fcmToken: token,
      fcmTokenUpdatedAt: FieldValue.serverTimestamp(),
    });
    
    await logEvent('fcm_token_saved', { userId });
  } catch (error) {
    console.error('Error saving FCM token (Firebase may not be configured):', error);
  }
};

// Delete FCM token on logout
export const deleteFCMToken = async (userId) => {
  try {
    const { getDbService } = require('./firebase');
    const dbInstance = getDbService();
    const usersCollection = dbInstance.collection('users');
    await usersCollection.doc(userId).update({
      fcmToken: FieldValue.delete(),
    });
    
    await logEvent('fcm_token_deleted', { userId });
  } catch (error) {
    console.error('Error deleting FCM token (Firebase may not be configured):', error);
  }
};
