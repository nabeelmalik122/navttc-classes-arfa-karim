import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrandHeader } from '@/shared/components/navigation/BrandHeader';

export const MarketingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col">
      <BrandHeader />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <footer className="py-8 px-8 border-t border-white/5 text-center text-xs text-[#5E6377]">
        © {new Date().getFullYear()} GymOS Enterprise. Awwwards Caliber Design Architecture.
      </footer>
    </div>
  );
};
