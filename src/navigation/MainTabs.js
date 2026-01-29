import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ChatListScreen from '../screens/ChatListScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#6C757D',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DEE2E6',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
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
        component={ChatListScreen}
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

