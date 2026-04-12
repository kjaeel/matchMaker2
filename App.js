import React, { useEffect } from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { setupForegroundMessageHandler } from './src/services/notifications';

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

export default function App() {
  useEffect(() => {
    // Set up foreground message handler
    const unsubscribe = setupForegroundMessageHandler();

    // Clean up on unmount
    return unsubscribe;
  }, []);

  //   useEffect(() => {
  //   console.log('Firebase ready:', firestore().app.name);
  // }, []);


  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}

