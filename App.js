import React from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { useForcedUpdate } from './src/hooks/useForcedUpdate.tsx';
import ForcedUpdateScreen from './src/components/ForcedUpdateScreen';

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

  const { forceUpdate, loading } = useForcedUpdate();
  
  console.log('forceUpdate', forceUpdate);

  if (forceUpdate) {
    return <ForcedUpdateScreen />;
  }


  return (
    <GestureHandlerRootView style={styles.container}>
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

