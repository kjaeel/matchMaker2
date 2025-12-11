import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { AuthContext } from '../context/AuthContext';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { getRemoteConfig, setDefaults, fetchAndActivate, getValue } from '@react-native-firebase/remote-config';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, user } = useContext(AuthContext);

  useEffect(() => {
    const initRemoteConfig = async () => {
      try {
        const configInstance = getRemoteConfig();
        await setDefaults(configInstance, {
          shouldUpdate: 'false',
        });

        await fetchAndActivate(configInstance);
        const shouldUpdateValue = getValue(configInstance, 'shouldUpdate').asString();
        console.log('Remote config shouldUpdate:', shouldUpdateValue);
      } catch (error) {
        console.warn('Remote config initialization failed:', error);
      }
    };

    initRemoteConfig();
  }, []);

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

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ 
          title: 'Profile Details',
          headerStyle: {
            backgroundColor: '#FF6B6B',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

