import { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid, FiList, FiCalendar, FiMail, FiUsers,
  FiShoppingBag, FiLogOut, FiMenu, FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import AdminOverview from './AdminOverview';
import AdminMenu from './AdminMenu';
import AdminReservations from './AdminReservations';
import AdminOrders from './AdminOrders';
import AdminContacts from './AdminContacts';

const NAV = [
  { to: '', label: 'Overview',     icon: FiGrid       },
  { to: 'menu',         label: 'Menu',         icon: FiList       },
  { to: 'reservations', label: 'Reservations', icon: FiCalendar   },
  { to: 'orders',       label: 'Orders',       icon: FiShoppingBag},
  { to: 'contacts',     label: 'Messages',     icon: FiMail       },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors
     ${isActive
       ? 'bg-gold/15 text-gold border border-gold/25'
       : 'text-offwhite/60 hover:bg-white/5 hover:text-offwhite border border-transparent'}`;

  return (
    <div className="min-h-screen bg-charcoal flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#141414]
                         border-r border-white/10 flex flex-col transition-transform duration-300
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center">
              <span className="font-heading font-bold text-charcoal text-sm">U</span>
            </div>
            <span className="font-heading text-offwhite text-base">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-offwhite/40 hover:text-offwhite">
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === ''} className={linkClass}>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-offwhite text-sm font-medium truncate">{user?.name}</p>
              <p className="text-offwhite/35 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300
                       px-3 py-2 rounded-sm hover:bg-white/5 transition-colors">
            <FiLogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-white/10 px-4 flex items-center gap-3 bg-[#141414] lg:bg-transparent">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-offwhite/50 hover:text-offwhite">
            <FiMenu size={20} />
          </button>
          <span className="text-offwhite/50 text-sm">Urban Cuisine — Admin</span>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
