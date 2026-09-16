import React from 'react';
import { Outlet } from 'react-router-dom';

export const TenantGuard: React.FC = () => {
  return <Outlet />;
};
