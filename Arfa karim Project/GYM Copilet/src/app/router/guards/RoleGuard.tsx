import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/core/types/user';
import { APP_ROUTES } from '@/core/config/constants';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  redirectPath = APP_ROUTES.LOGIN,
}) => {
  const { role } = useAuthStore();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
