import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ChatScreen from '../screens/ChatScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[600],
        tabBarStyle: {
          backgroundColor: colors.surfaceGold,
          borderTopColor: colors.secondary,
          borderTopWidth: 4,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          shadowColor: colors.maroon,
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 16,
          borderLeftWidth: 3,
          borderLeftColor: colors.primary,
          borderRightWidth: 3,
          borderRightColor: colors.primary,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="home" 
              color={color} 
              size={size} 
            />
          ),
          tabBarLabel: 'Discover',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="magnify" 
              color={color} 
              size={size} 
            />
          ),
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="heart" 
              color={color} 
              size={size} 
            />
          ),
          tabBarLabel: 'Matches',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="chat" 
              color={color} 
              size={size} 
            />
          ),
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="account" 
              color={color} 
              size={size} 
            />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

