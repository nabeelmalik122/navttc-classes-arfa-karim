import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { KineticLoader } from '@/shared/components/feedback/KineticLoader';
import { APP_ROUTES } from '@/core/config/constants';

export const AuthGuard: React.FC = () => {
  const { status, role } = useAuthStore();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709]">
        <KineticLoader label="Verifying Session..." />
      </div>
    );
  }

  // If no role or unauthenticated
  if (!role) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
