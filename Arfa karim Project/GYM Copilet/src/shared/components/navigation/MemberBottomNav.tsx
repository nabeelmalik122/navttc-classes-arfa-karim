import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { APP_ROUTES } from '@/core/config/constants';

const memberNavItems = [
  { label: 'Today', path: APP_ROUTES.MEMBER_DASHBOARD },
  { label: 'Classes', path: APP_ROUTES.MEMBER_CLASSES },
  { label: 'Bookings', path: APP_ROUTES.MEMBER_BOOKINGS },
  { label: 'Workouts', path: APP_ROUTES.MEMBER_WORKOUTS },
  { label: 'Profile', path: APP_ROUTES.MEMBER_PROFILE },
];

export const MemberBottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0B0B0E]/90 backdrop-blur-lg border-t border-[#22222B] flex items-center justify-around px-4 z-40">
      {memberNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === APP_ROUTES.MEMBER_DASHBOARD}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center text-xs font-medium py-1 transition-colors',
              isActive ? 'text-[#FF1E27]' : 'text-[#A1A1A6] hover:text-white'
            )
          }
        >
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
