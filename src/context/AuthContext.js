import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { authAPI, notificationAPI } from '../services/api';
import messaging from '@react-native-firebase/messaging';
import { requestNotificationPermission, getFCMToken } from '../services/notifications';

const SESSION_KEY = 'MM_SESSION_V1';

export const AuthContext = createContext({
  isLoading: true,
  user: null,
  likedProfileIds: [],
  login: async (_identifier, _password) => {},
  register: async (_payload) => {},
  logout: async () => {},
  completeProfile: async (_profile) => {},
  toggleLike: (_profileId) => {},
  setPhotoUri: async (_uri) => {},
});

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [likedProfileIds, setLikedProfileIds] = useState([]);

  const persist = useCallback(async (nextUser, nextLikes) => {
    const payload = { user: nextUser ?? user, likedProfileIds: nextLikes ?? likedProfileIds };
    await EncryptedStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  }, [user, likedProfileIds]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await EncryptedStorage.getItem(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.user) setUser(parsed.user);
          if (Array.isArray(parsed?.likedProfileIds)) setLikedProfileIds(parsed.likedProfileIds);
        }
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  // Listen for FCM token refresh
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = messaging().onTokenRefresh(async (token) => {
      console.log('🔔 FCM Token refreshed:', token);
      await notificationAPI.registerToken(user.id, token);
    });

    return unsubscribe;
  }, [user?.id]);

  const login = useCallback(async (identifier, password) => {
    if (!identifier || !password) throw new Error('Missing credentials');
    
    console.log('🔐 AuthContext.login called with:', { identifier: identifier.substring(0, 3) + '***', passwordLength: password.length });
    
    // Call login API
    const result = await authAPI.login(identifier, password);
    
    console.log('🔐 AuthContext.login result:', { success: result.success, error: result.error, status: result.status });
    
    if (!result.success) {
      const errorMsg = result.status === 403 
        ? 'Access forbidden. Please check your credentials or contact support.'
        : (result.error || 'Login failed');
      throw new Error(errorMsg);
    }
    
    // Store user data from API response
    const apiUser = result.data;
    const nextUser = {
      id: apiUser.id,
      name: apiUser.name,
      fullName: apiUser.name,
      age: apiUser.age,
      gender: apiUser.gender,
      email: apiUser.email,
      phone: apiUser.phone,
      city: apiUser.city,
      religion: apiUser.religion,
      caste: apiUser.caste,
      photoUri: apiUser.imagePaths?.[0] || undefined,
      profile: {
        age: apiUser.age,
        gender: apiUser.gender,
        city: apiUser.city,
        religion: apiUser.religion,
        caste: apiUser.caste,
      },
      isProfileComplete: true,
    };
    setUser(nextUser);
    await persist(nextUser, undefined);

    // Register FCM token after successful login
    try {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        const token = await getFCMToken();
        if (token) {
          await notificationAPI.registerToken(nextUser.id, token);
        }
      }
    } catch (error) {
      console.error('❌ Error setting up notifications:', error);
      // Don't fail login if notifications fail
    }
  }, [persist]);

  const register = useCallback(async (payload) => {
    const nextUser = {
      id: String(Date.now()),
      fullName: payload.fullName,
      email: payload.email || undefined,
      phone: payload.phone || undefined,
      gender: payload.gender || undefined,
      dob: payload.dob || undefined,
      photoUri: undefined,
      profile: null,
      isProfileComplete: false, // Set to false for register flow - will show profile setup
    };
    setUser(nextUser);
    await persist(nextUser, undefined);

    // Register FCM token after successful registration
    try {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        const token = await getFCMToken();
        if (token) {
          await notificationAPI.registerToken(nextUser.id, token);
        }
      }
    } catch (error) {
      console.error('❌ Error setting up notifications after registration:', error);
    }
  }, [persist]);

  const completeProfile = useCallback(async (profile) => {
    const nextUser = { ...(user || {}), profile, isProfileComplete: true };
    setUser(nextUser);
    await persist(nextUser, undefined);
  }, [persist, user]);

  const setPhotoUri = useCallback(async (uri) => {
    const nextUser = { ...(user || {}), photoUri: uri };
    setUser(nextUser);
    await persist(nextUser, undefined);
  }, [persist, user]);

  const toggleLike = useCallback((profileId) => {
    setLikedProfileIds((prev) => {
      const exists = prev.includes(profileId);
      const next = exists ? prev.filter(id => id !== profileId) : [...prev, profileId];
      persist(undefined, next);
      return next;
    });
  }, [persist]);

  const logout = useCallback(async () => {
    setUser(null);
    setLikedProfileIds([]);
    await EncryptedStorage.removeItem(SESSION_KEY);
  }, []);

  const value = useMemo(() => ({
    isLoading, user, likedProfileIds,
    login, register, logout, completeProfile, toggleLike, setPhotoUri,
  }), [isLoading, user, likedProfileIds, login, register, logout, completeProfile, toggleLike, setPhotoUri]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

