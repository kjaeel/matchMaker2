import React, { useEffect, useRef } from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import {
  setupForegroundMessageHandler,
  setupNotificationOpenedHandler,
  checkInitialNotification,
  requestNotificationPermission,
  saveFCMToken,
} from './src/services/notifications';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#7b2cbf',
    secondary: '#f28482',
    background: '#ffffff',
    surface: '#ffffff',
  },
};

function AppContent() {
  const navigationRef = useRef(null);

  useEffect(() => {
    let unsubscribeNotificationOpened = null;

    // Request notification permission on app start
    requestNotificationPermission().then((token) => {
      if (token) {
        console.log('FCM Token obtained:', token);
        // Save token to user's profile when user is logged in
        // This will be handled in AuthContext or when user logs in
      }
    });

    // Setup foreground message handler
    const unsubscribeForeground = setupForegroundMessageHandler();

    // Wait for navigation to be ready before setting up handlers
    const timer = setTimeout(() => {
      if (navigationRef.current) {
        // Setup notification opened handler
        unsubscribeNotificationOpened = setupNotificationOpenedHandler(navigationRef.current);

        // Check if app was opened from notification
        checkInitialNotification(navigationRef.current);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      unsubscribeForeground();
      if (unsubscribeNotificationOpened) {
        unsubscribeNotificationOpened();
      }
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

