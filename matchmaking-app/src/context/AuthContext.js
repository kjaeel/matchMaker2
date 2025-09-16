import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

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
    const nextUser = {
      id: 'u1',
      fullName: 'New User',
      email: identifier.includes('@') ? identifier : undefined,
      phone: !identifier.includes('@') ? identifier : undefined,
      gender: undefined,
      dob: undefined,
      photoUri: undefined,
      profile: null,
      isProfileComplete: false,
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
      isProfileComplete: false,
    };
    setUser(nextUser);
    await persist(nextUser, undefined);
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
