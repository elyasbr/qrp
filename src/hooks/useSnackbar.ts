import { useState, useCallback } from 'react';
import { SnackbarType } from '@/components/common/Snackbar';

interface SnackbarState {
  isOpen: boolean;
  message: string;
  type: SnackbarType;
  duration: number;
}

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: '',
    type: 'info',
    duration: 5000,
  });

  const showSnackbar = useCallback((
    message: string, 
    type: SnackbarType = 'info', 
    duration: number = 5000
  ) => {
    setSnackbar({
      isOpen: true,
      message,
      type,
      duration,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showSnackbar(message, 'success', duration);
  }, [showSnackbar]);

  const showError = useCallback((message: string, duration?: number) => {
    showSnackbar(message, 'error', duration);
  }, [showSnackbar]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showSnackbar(message, 'warning', duration);
  }, [showSnackbar]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showSnackbar(message, 'info', duration);
  }, [showSnackbar]);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 