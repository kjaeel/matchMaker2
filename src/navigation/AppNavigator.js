import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { AuthContext } from '../context/AuthContext';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  if (!user.isProfileComplete) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupScreen}
          options={{ title: 'Complete Your Profile' }}
        />
      </Stack.Navigator>
    );
  }

  return <MainTabs />;
}

