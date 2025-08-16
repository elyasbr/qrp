import { useState, useEffect, useCallback } from 'react';
import { getToken, setToken, removeToken, isAuthenticated, getAuthPayload } from '@/services/api/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPayload, setUserPayload] = useState<any>(null);

  const checkAuthStatus = useCallback(() => {
    const token = getToken();
    const authenticated = isAuthenticated();
    const payload = getAuthPayload();
    
    setIsLoggedIn(authenticated);
    setUserPayload(payload);
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    setToken(token);
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = useCallback(() => {
    removeToken();
    setIsLoggedIn(false);
    setUserPayload(null);
  }, []);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for token updates
    const handleTokenUpdate = () => {
      checkAuthStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('tokenUpdated', handleTokenUpdate);
      return () => window.removeEventListener('tokenUpdated', handleTokenUpdate);
    }
  }, [checkAuthStatus]);

  return {
    isLoading,
    isLoggedIn,
    userPayload,
    login,
    logout,
    checkAuthStatus,
  };
}; 