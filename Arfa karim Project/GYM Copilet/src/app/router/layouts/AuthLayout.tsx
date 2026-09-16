import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { APP_ROUTES } from '@/core/config/constants';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8">
        <Link to={APP_ROUTES.HOME} className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 bg-[#CCFF00] rounded-sm" />
          <span className="font-bold text-xl tracking-tight text-white font-display">GYMOS</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
