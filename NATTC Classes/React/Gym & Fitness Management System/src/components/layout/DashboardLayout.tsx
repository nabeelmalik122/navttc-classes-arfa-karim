import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  LineChart,
  CreditCard,
  Bell,
  Settings,
  Users,
  Award,
  BookOpen,
  DollarSign,
  Star,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { IronyxLogo } from "@/components/ui/IronyxLogo";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/useAuthStore";
import { useGymStore } from "@/store/useGymStore";
import { useTheme } from "@/context/ThemeContext";
import type { UserRole } from "@/types";

interface NavGroup {
  groupLabel?: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, activeRole, switchSandboxRole, logout, isDemoMode } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const notifications = useGymStore((s) => s.notifications);
  const markNotificationAsRead = useGymStore((s) => s.markNotificationAsRead);
  const markAllNotificationsAsRead = useGymStore((s) => s.markAllNotificationsAsRead);

  const userNotifications = notifications.filter(
    (n) => !user || n.userId === user.uid || n.userId === "all"
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  // Close drawers on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Keyboard accessibility: Close mobile drawer & popovers on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showNotifications) {
          setShowNotifications(false);
        } else if (mobileOpen) {
          setMobileOpen(false);
        }
      }
    },
    [mobileOpen, showNotifications]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Dedicated wheel listener on sidebar:
  // Stops the background window/page from scrolling when cursor is over the sidebar,
  // and directly scrolls the sidebar navigation items.
  useEffect(() => {
    const sidebar = sidebarRef.current;
    const nav = navRef.current;
    if (!sidebar || !nav) return;

    const onWheel = (e: WheelEvent) => {
      // Prevent the main background page from scrolling
      e.preventDefault();
      e.stopPropagation();

      // Directly scroll the sidebar nav smoothly
      nav.scrollTop += e.deltaY;
    };

    sidebar.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      sidebar.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Role-specific Categorized Navigation Schemes
  const memberNavGroups: NavGroup[] = [
    {
      groupLabel: "Training & Performance",
      items: [
        { label: "Overview", href: "/member/dashboard", icon: LayoutDashboard },
        { label: "Class Bookings", href: "/member/bookings", icon: Calendar },
        { label: "Workout Routines", href: "/member/workouts", icon: Dumbbell },
        { label: "Performance Metrics", href: "/member/progress", icon: LineChart },
      ],
    },
    {
      groupLabel: "Athlete Account",
      items: [
        { label: "Membership Tier", href: "/member/membership", icon: CreditCard },
        { label: "Settings & Bio", href: "/member/settings", icon: Settings },
      ],
    },
  ];

  const trainerNavGroups: NavGroup[] = [
    {
      groupLabel: "Coaching & Floor",
      items: [
        { label: "Coach Console", href: "/trainer/dashboard", icon: LayoutDashboard },
        { label: "Assigned Classes", href: "/trainer/classes", icon: Calendar },
        { label: "Schedule & Hours", href: "/trainer/schedule", icon: BookOpen },
      ],
    },
    {
      groupLabel: "Athletes & Protocols",
      items: [
        { label: "Client Roster", href: "/trainer/clients", icon: Users },
        { label: "Workout Builder", href: "/trainer/workouts", icon: Dumbbell },
        { label: "Settings", href: "/trainer/settings", icon: Settings },
      ],
    },
  ];

  const adminNavGroups: NavGroup[] = [
    {
      groupLabel: "Command & Intelligence",
      items: [
        { label: "Executive BI", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Financial Analytics", href: "/admin/analytics", icon: LineChart },
      ],
    },
    {
      groupLabel: "Facility Operations",
      items: [
        { label: "Member Directory", href: "/admin/members", icon: Users },
        { label: "Trainers & Staff", href: "/admin/trainers", icon: Award },
        { label: "Class Master", href: "/admin/classes", icon: Calendar },
        { label: "Bookings Ledger", href: "/admin/bookings", icon: BookOpen },
      ],
    },
    {
      groupLabel: "Commerce & System",
      items: [
        { label: "Membership Plans", href: "/admin/plans", icon: DollarSign },
        { label: "Member Reviews", href: "/admin/reviews", icon: Star },
        { label: "System Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const currentNavGroups =
    activeRole === "admin"
      ? adminNavGroups
      : activeRole === "trainer"
      ? trainerNavGroups
      : memberNavGroups;

  // Derive Current Page Title for Breadcrumb
  const getCurrentPageTitle = (): string => {
    for (const group of currentNavGroups) {
      const match = group.items.find((item) => item.href === location.pathname);
      if (match) return match.label;
    }
    return "Dashboard";
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)] font-sans antialiased selection:bg-[#dfff00] selection:text-[#08080a] transition-colors duration-300">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Architecture */}
      <aside
        ref={sidebarRef}
        id="dashboard-sidebar"
        role="navigation"
        aria-label="Dashboard Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-50 bg-[var(--color-surface-base)] border-r border-[var(--color-border-subtle)] transition-all duration-300 flex flex-col overscroll-contain ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div
          className={`h-18 flex items-center ${
            collapsed ? "justify-center px-3" : "justify-between px-4"
          } border-b border-[#1f1f26] shrink-0`}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] rounded-xl p-1 group cursor-pointer"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#08080a] border border-[#1f1f26] group-hover:border-[#dfff00] flex items-center justify-center text-[#dfff00] shadow-sm transition-all duration-200">
                <IronyxLogo className="w-5 h-5 text-[#dfff00] group-hover:scale-110 transition-transform" />
              </div>
            </button>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] rounded-xl p-1"
                aria-label="IRONX Home"
                title="IRONX Sanctuary"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] shadow-sm">
                  <IronyxLogo className="w-5 h-5 text-[#dfff00]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-base tracking-wider uppercase font-heading text-white truncate">
                    IRONX
                  </span>
                  <span className="text-[10px] text-[#71717a] font-mono tracking-widest uppercase truncate">
                    {activeRole} Console
                  </span>
                </div>
              </Link>
            </>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#121217] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00]"
            aria-label="Close sidebar navigation"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Current Active Role Indicator (Expanded Only) */}
        {!collapsed && (
          <div className="px-4 py-2.5 border-b border-[#1f1f26] bg-[#08080a] shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#a1a1aa] font-mono uppercase tracking-wider">
                Clearance:
              </span>
              <Badge
                variant={
                  activeRole === "admin"
                    ? "destructive"
                    : activeRole === "trainer"
                    ? "warning"
                    : "volt"
                }
                className="text-[10px] font-mono font-bold uppercase"
              >
                {activeRole}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Items Organized by Groups */}
        <nav
          ref={navRef}
          className="flex-1 min-h-0 px-3 py-4 space-y-4 overflow-y-auto dashboard-scrollbar overscroll-contain"
        >
          {currentNavGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && group.groupLabel && (
                <div className="px-3 pb-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#71717a]">
                  {group.groupLabel}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center ${
                      collapsed ? "justify-center w-11 h-11 mx-auto px-0" : "gap-3 px-3 min-h-[44px]"
                    } rounded-xl text-xs font-semibold transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] ${
                      isActive
                        ? "bg-[#16161b] text-white border border-[#2e2e38] shadow-sm font-bold"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#121217]"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-[#dfff00]" : "text-[#71717a] group-hover:text-[#f4f4f5]"
                      }`}
                      aria-hidden="true"
                    />
                    {!collapsed && (
                      <span className="truncate flex-1 tracking-tight">{item.label}</span>
                    )}
                    {!collapsed && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dfff00] shrink-0" aria-hidden="true" />
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#08080a] border border-[#1f1f26] text-[#dfff00]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Public Website Shortcut */}
          <div className="pt-2 border-t border-[#1f1f26]">
            <Link
              to="/"
              className={`flex items-center ${
                collapsed ? "justify-center w-11 h-11 mx-auto px-0" : "gap-3 px-3 min-h-[40px]"
              } rounded-xl text-xs font-medium text-[#71717a] hover:text-white hover:bg-[#121217] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#dfff00]`}
              title="Public Website"
            >
              <ExternalLink className="w-4 h-4 text-[#71717a]" aria-hidden="true" />
              {!collapsed && <span>Public Website</span>}
            </Link>
          </div>
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="p-3 border-t border-[#1f1f26] bg-[#08080a] shrink-0">
          <div className={`flex items-center ${collapsed ? "flex-col gap-2.5 justify-center" : "gap-3"}`}>
            <img
              src={
                user?.photoURL ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              }
              alt={user?.displayName || "User Avatar"}
              className="w-9 h-9 rounded-xl object-cover border border-[#1f1f26] shrink-0"
              title={collapsed ? (user?.displayName || "Athlete") : undefined}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.displayName || "Athlete"}
                </p>
                <p className="text-[11px] text-[#71717a] truncate font-mono">
                  {user?.email}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className={`rounded-lg text-[#71717a] hover:text-red-400 hover:bg-[#121217] transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                collapsed ? "w-9 h-9 border border-[#1f1f26] bg-[#0c0c10]" : "p-2 min-h-[40px] min-w-[40px]"
              }`}
              title="Sign Out of IRONX"
              aria-label="Sign out of IRONX"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-18 bg-[var(--color-surface-base)] border-b border-[var(--color-border-subtle)] px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#121217] border border-[#1f1f26] text-[#a1a1aa] hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00]"
              aria-label={mobileOpen ? "Close sidebar menu" : "Open sidebar menu"}
              aria-expanded={mobileOpen}
              aria-controls="dashboard-sidebar"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            {/* Desktop Sidebar Expand/Collapse Toggle */}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-xl bg-[#121217] border border-[#1f1f26] text-[#a1a1aa] hover:text-white hover:border-[#2e2e38] transition-colors min-h-[38px] min-w-[38px] items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              ) : (
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {/* Contextual Breadcrumb / Page Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] uppercase tracking-wider">
                <span>IRONX</span>
                <span>/</span>
                <span className="text-[#a1a1aa]">{activeRole}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading truncate">
                {getCurrentPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Isolated Sandbox Multi-Role Switcher (Visible in demo mode) */}
            {isDemoMode && (
              <div
                className="hidden md:flex items-center gap-2 bg-[#08080a] border border-[#1f1f26] p-1 rounded-xl text-xs"
                role="group"
                aria-label="Sandbox Role Clearance Switcher"
              >
                <span className="px-2 text-[9px] font-mono text-[#71717a] uppercase tracking-wider shrink-0">
                  Clearance:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    switchSandboxRole("member");
                    navigate("/member/dashboard");
                  }}
                  className={`min-w-[68px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[30px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#dfff00] ${
                    activeRole === "member"
                      ? "bg-[#dfff00] text-[#08080a] font-bold shadow-sm"
                      : "bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white hover:bg-white/10"
                  }`}
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchSandboxRole("trainer");
                    navigate("/trainer/dashboard");
                  }}
                  className={`min-w-[68px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[30px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
                    activeRole === "trainer"
                      ? "bg-amber-400 text-[#08080a] font-bold shadow-sm"
                      : "bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white hover:bg-white/10"
                  }`}
                >
                  Trainer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchSandboxRole("admin");
                    navigate("/admin/dashboard");
                  }}
                  className={`min-w-[68px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[30px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 ${
                    activeRole === "admin"
                      ? "bg-red-500 text-white font-bold shadow-sm"
                      : "bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white hover:bg-white/10"
                  }`}
                >
                  Admin
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className="relative p-2.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[#dfff00] hover:border-[#dfff00]/30 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00]"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {/* Notification Bell with Dropdown Popover */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-[#121217] border border-[#1f1f26] text-[#a1a1aa] hover:text-white hover:border-[#2e2e38] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00]"
                title="System Notifications"
                aria-label={`Notifications: ${unreadCount} unread`}
                aria-expanded={showNotifications}
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#dfff00] text-[#08080a] text-[9px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {showNotifications && (
                <div
                  className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-3 w-auto sm:w-96 max-w-[calc(100vw-1.5rem)] sm:max-w-md rounded-2xl border border-[#1f1f26] bg-[#0c0c10] shadow-2xl p-4 z-50 overflow-hidden"
                  role="region"
                  aria-label="System Notification Feed"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#1f1f26]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-heading uppercase">Notifications</span>
                      {unreadCount > 0 && (
                        <Badge variant="volt" className="text-[10px] font-mono">{unreadCount} New</Badge>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-[#71717a] hover:text-[#dfff00] transition-colors cursor-pointer font-mono min-h-[32px] px-2 py-1 rounded"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-[#1f1f26] max-h-80 overflow-y-auto py-1 scrollbar-thin">
                    {userNotifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#71717a] font-mono space-y-1">
                        <Bell className="w-5 h-5 mx-auto text-[#71717a] opacity-50 mb-1" aria-hidden="true" />
                        <p>No new alerts or notices on the ledger.</p>
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.link) {
                              navigate(notif.link);
                              setShowNotifications(false);
                            }
                          }}
                          className={`py-3 px-2.5 rounded-xl transition-colors cursor-pointer my-1 ${
                            notif.read
                              ? "opacity-60 hover:bg-[#121217]"
                              : "bg-[#121217] hover:bg-[#16161b] border border-[#1f1f26]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge
                                variant={notif.type === "booking" ? "volt" : "default"}
                                className="text-[9px] font-mono uppercase px-1.5 py-0"
                              >
                                {notif.type}
                              </Badge>
                              <span className="text-xs font-semibold text-[#f4f4f5]">
                                {notif.title}
                              </span>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#dfff00] shrink-0 mt-1" aria-hidden="true" />
                            )}
                          </div>
                          <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-[#71717a] font-mono block mt-1.5">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

