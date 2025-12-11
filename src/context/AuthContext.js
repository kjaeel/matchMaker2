import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { userAPI } from '../services/api';

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

  const login = useCallback(async (identifier, password) => {
    if (!identifier || !password) throw new Error('Missing credentials');
    
    // Call login API
    const result = await userAPI.login(identifier, password);
    
    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }
    
    // Store the result in context
    const userData = result.data;
    const nextUser = {
      id: userData.id || userData.userId,
      fullName: userData.fullName || userData.name,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      dob: userData.dob || userData.dateOfBirth,
      photoUri: userData.photoUri || userData.photo,
      profile: userData.profile || {
        age: userData.age,
        heightCm: userData.heightCm,
        education: userData.education,
        occupation: userData.occupation,
        religion: userData.religion,
        caste: userData.caste,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        interests: userData.interests || [],
      },
      interests: userData.interests || [],
      isProfileComplete: userData.isProfileComplete || !!userData.profile,
    };
    
    setUser(nextUser);
    await persist(nextUser, undefined);
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
      interests: payload.interests || [],
      isProfileComplete: false, // Set to false for register flow - will show profile setup
    };
    setUser(nextUser);
    await persist(nextUser, undefined);
  }, [persist]);

  const completeProfile = useCallback(async (profile) => {
    const nextUser = { 
      ...(user || {}), 
      profile, 
      interests: profile.interests || user?.interests || [],
      isProfileComplete: true 
    };
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

