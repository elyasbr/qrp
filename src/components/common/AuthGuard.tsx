"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = null, 
  redirectTo = "/" 
}) => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-[var(--main-color)]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--main-color)] animate-spin"></div>
          </div>
          <div className="text-[var(--main-color)] font-semibold">در حال بارگذاری...</div>
      </div>
  </div>
    );
  }

  // Show fallback or redirect if not authenticated
  if (!isLoggedIn) {
    return fallback;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard; 