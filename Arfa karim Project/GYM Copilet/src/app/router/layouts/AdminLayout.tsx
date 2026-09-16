import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/shared/components/navigation/AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top telemetry bar shell */}
        <header className="h-16 border-b border-[#232533] px-8 flex items-center justify-between bg-[#0D0E12]/50 backdrop-blur-md sticky top-0 z-30">
          <div className="text-xs text-[#9EA3B5] font-mono">WORKSPACE: ENTERPRISE HQ</div>
          <div className="flex items-center space-x-4">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
            <span className="text-xs text-[#CCFF00] font-mono">FIREBASE ONLINE</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
