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
    
    console.log('useAuth: Checking auth status:', {
      hasToken: !!token,
      tokenLength: token?.length,
      authenticated,
      payload,
      timestamp: new Date().toISOString()
    });
    
    setIsLoggedIn(authenticated);
    setUserPayload(payload);
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    console.log('useAuth: Login called with token:', token?.substring(0, 20) + '...');
    setToken(token);
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = useCallback(() => {
    console.log('useAuth: Logout called');
    removeToken();
    setIsLoggedIn(false);
    setUserPayload(null);
  }, []);

  useEffect(() => {
    console.log('useAuth: Initializing...');
    checkAuthStatus();
    
    // Listen for token updates
    const handleTokenUpdate = () => {
      console.log('useAuth: Token update event received');
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