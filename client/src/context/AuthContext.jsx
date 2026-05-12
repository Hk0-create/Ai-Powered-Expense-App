import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import api, { refreshApi, setupInterceptors } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref so interceptors always have the latest token without re-registering
  const tokenRef = useRef(accessToken);
  useEffect(() => { tokenRef.current = accessToken; }, [accessToken]);

  const logout = useCallback(async () => {
    try {
      // Use refreshApi (no interceptors) to avoid triggering another 401 loop
      await refreshApi.post('/auth/logout');
    } catch {
      // Ignore logout errors — cookie will expire naturally
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  // Register interceptors once on mount
  useEffect(() => {
    setupInterceptors(
      () => tokenRef.current,
      (token) => { tokenRef.current = token; setAccessToken(token); },
      logout
    );

    const initAuth = async () => {
      try {
        // ✅ Use refreshApi (NO interceptors) to silently restore session.
        // This is the critical fix — using the main `api` here would cause
        // a 401 → interceptor → refresh → 401 → ... infinite loop.
        const { data } = await refreshApi.post('/auth/refresh');
        const token = data.data.accessToken;

        setAccessToken(token);
        tokenRef.current = token;

        // Now fetch user data with the fresh token attached manually
        const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data.data);
      } catch {
        // No active session — this is normal on first visit, not an error
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const token = data.data.accessToken;
    setAccessToken(token);
    tokenRef.current = token;
    setUser(data.data.user);
  };

  const register = async (userData) => {
    await api.post('/auth/register', userData);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
