import React from 'react';
import { Outlet } from 'react-router-dom';

export const TrainerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col">
      <header className="h-16 border-b border-[#232533] px-6 flex items-center justify-between bg-[#0D0E12] sticky top-0 z-30">
        <div className="font-bold text-sm tracking-wider text-white">COACH HUD</div>
        <div className="text-xs text-[#00F0FF] font-mono">TRAINER MODE</div>
      </header>

      <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
