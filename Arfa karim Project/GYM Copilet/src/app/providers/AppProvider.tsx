import React, { type ReactNode } from 'react';
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary';
import { AuthProvider } from './AuthProvider';
import { GSAPProvider } from './GSAPProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <GSAPProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </GSAPProvider>
    </ErrorBoundary>
  );
};
