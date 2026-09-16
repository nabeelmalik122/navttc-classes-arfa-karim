import React from 'react';
import { Outlet } from 'react-router-dom';
import { MemberBottomNav } from '@/shared/components/navigation/MemberBottomNav';

export const MemberLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col pb-20">
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#0D0E12]/80 backdrop-blur sticky top-0 z-30">
        <div className="font-bold text-sm tracking-wider text-white">ATHLETE PORTAL</div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#CCFF00]" />
      </header>

      <main className="flex-1 p-4 max-w-lg w-full mx-auto">
        <Outlet />
      </main>

      <MemberBottomNav />
    </div>
  );
};
