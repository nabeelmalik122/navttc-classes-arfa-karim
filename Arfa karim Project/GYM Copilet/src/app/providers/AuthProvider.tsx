import React, { useEffect, type ReactNode } from 'react';
import { FirebaseAuthService } from '@/services/firebase/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setRole, setStatus, logout } = useAuthStore();

  useEffect(() => {
    setStatus('loading');
    const unsubscribe = FirebaseAuthService.onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        logout();
        setStatus('idle');
        return;
      }

      try {
        const claims = await FirebaseAuthService.getCustomClaims(firebaseUser);
        setRole(claims.role ?? 'member');
        setStatus('success');
      } catch (err) {
        console.error('Failed to resolve custom auth claims:', err);
        setStatus('error');
      }
    });

    return () => unsubscribe();
  }, [setRole, setStatus, logout]);

  return <>{children}</>;
};
