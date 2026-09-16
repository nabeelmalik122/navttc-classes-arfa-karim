import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/core/config/constants';

export const BrandHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#050507]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-50">
      <Link to={APP_ROUTES.HOME} className="flex items-center space-x-3">
        <div className="w-3.5 h-3.5 bg-[#FF1E27] rounded-sm shadow-[0_0_10px_#FF1E27]" />
        <span className="font-bold text-xl tracking-tight text-white font-display">GYMOS</span>
      </Link>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#A1A1A6]">
        <Link to={APP_ROUTES.CLASSES} className="hover:text-white transition-colors">Classes</Link>
        <Link to={APP_ROUTES.TRAINERS} className="hover:text-white transition-colors">Trainers</Link>
        <Link to={APP_ROUTES.PRICING} className="hover:text-white transition-colors">Pricing</Link>
        <Link to={APP_ROUTES.CONTACT} className="hover:text-white transition-colors">Contact</Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link
          to={APP_ROUTES.LOGIN}
          className="text-sm font-medium text-[#A1A1A6] hover:text-white transition-colors px-3 py-2"
        >
          Sign In
        </Link>
        <Link
          to={APP_ROUTES.REGISTER}
          className="text-sm font-semibold bg-[#FF1E27] text-white px-4 py-2 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:scale-105"
        >
          Join Now
        </Link>
      </div>
    </header>
  );
};
