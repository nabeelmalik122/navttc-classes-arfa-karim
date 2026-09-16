import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { APP_ROUTES } from '@/core/config/constants';

export interface NavItem {
  label: string;
  path: string;
}

const adminNavItems: NavItem[] = [
  { label: 'Overview', path: APP_ROUTES.ADMIN_DASHBOARD },
  { label: 'Members', path: APP_ROUTES.ADMIN_MEMBERS },
  { label: 'Classes', path: APP_ROUTES.ADMIN_CLASSES },
  { label: 'Trainers', path: APP_ROUTES.ADMIN_TRAINERS },
  { label: 'Analytics', path: APP_ROUTES.ADMIN_ANALYTICS },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0B0B0E] border-r border-[#22222B] flex flex-col p-4 z-40">
      <div className="flex items-center space-x-2 px-3 py-4 mb-6">
        <div className="w-3 h-3 bg-[#FF1E27] rounded-sm" />
        <span className="font-bold text-lg tracking-wider text-white">GYMOS</span>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#FF1E27]/10 text-[#FF1E27] rounded">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === APP_ROUTES.ADMIN_DASHBOARD}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#121217] text-[#FF1E27] border-l-2 border-[#FF1E27] pl-2.5'
                  : 'text-[#A1A1A6] hover:text-white hover:bg-[#121217]/50'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[#22222B] text-xs text-[#63636E] font-mono">
        PORTFOLIO v1.0
      </div>
    </aside>
  );
};
