import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register background handler (only if Firebase is configured)
try {
  const { getApp } = require('@react-native-firebase/app');
  const { getMessaging } = require('@react-native-firebase/messaging');
  const { setupBackgroundMessageHandler } = require('./src/services/notifications');
  
  // Ensure Firebase app is initialized
  const app = getApp();
  const messagingInstance = getMessaging(app);
  // Call method directly without storing reference
  messagingInstance.setBackgroundMessageHandler(setupBackgroundMessageHandler);
} catch (error) {
  console.warn('Firebase Messaging not available. Background message handler not registered. Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is configured.', error.message);
}

AppRegistry.registerComponent(appName, () => App);
