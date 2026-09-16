import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IronyxLogo } from "@/components/ui/IronyxLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "@/context/ThemeContext";
import { Dock, DockItem } from "@/components/reactbits/Dock";
import { scrollToTop } from "@/components/ui/ScrollToTopButton";
import type { UserRole } from "@/types";

const NAV_LINKS = [
  { label: "Programs", href: "/programs" },
  { label: "Classes", href: "/classes" },
  { label: "Trainers", href: "/trainers" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "top">("top");
  const location = useLocation();
  const { isAuthenticated, activeRole, switchSandboxRole, isDemoMode } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);

      if (currentY <= 20) {
        setScrollDirection("top");
      } else if (currentY > lastY && currentY > 80) {
        setScrollDirection("down");
      } else if (currentY < lastY) {
        setScrollDirection("up");
      }
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Keyboard accessibility: Close mobile menu on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    },
    [mobileMenuOpen]
  );

  useEffect(() => {
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileMenuOpen, handleKeyDown]);

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "trainer":
        return "/trainer/dashboard";
      case "member":
      default:
        return "/member/dashboard";
    }
  };

  const isDark = theme === "dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollDirection === "down" && !mobileMenuOpen
          ? "-translate-y-2 py-2 opacity-95"
          : "translate-y-0"
      } ${
        isScrolled
          ? isDark
            ? "bg-[#08080a]/90 backdrop-blur-md border-b border-[#1f1f26] py-3 shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            : "bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 shadow-sm"
          : isDark
            ? "bg-transparent border-b border-transparent py-4 sm:py-5"
            : "bg-transparent border-b border-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => scrollToTop(true)}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] rounded-xl p-1 -m-1"
          aria-label="IRONX Home"
        >
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:border-[#dfff00] transition-colors shadow-sm text-[#dfff00] ${isDark
              ? "bg-[#0d0d11] border-[#1f1f26]"
              : "bg-zinc-50 border-zinc-200"
              }`}
          >
            <IronyxLogo className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-extrabold text-lg tracking-wider font-['Outfit'] uppercase flex items-center gap-1 leading-tight ${isDark ? "text-[#f4f4f5]" : "text-[#0a0a0a]"
                }`}
            >
              IRONX
            </span>
            <span
              className={`text-[10px] font-mono tracking-widest uppercase ${isDark ? "text-[#71717a]" : "text-zinc-400"
                }`}
            >
              Athletic Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with React Bits Dock Magnification */}
        <div className="hidden lg:flex items-center">
          <Dock
            distance={130}
            baseItemSize={40}
            magnification={48}
            className={`flex items-center gap-1 border px-2 py-1 rounded-full ${isDark
              ? "bg-[#0d0d11] border-[#1f1f26]"
              : "bg-zinc-50 border-zinc-200"
              }`}
          >
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <DockItem key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => scrollToTop(true)}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] flex items-center select-none ${isActive
                      ? isDark
                        ? "bg-[#1a1a22] text-[#f4f4f5] font-bold border border-[#2e2e38]"
                        : "bg-white text-[#0a0a0a] font-bold border border-zinc-200 shadow-sm"
                      : isDark
                        ? "text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#121217]"
                        : "text-zinc-500 hover:text-[#0a0a0a] hover:bg-white"
                      }`}
                  >
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#dfff00] mr-1.5 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {link.label}
                  </Link>
                </DockItem>
              );
            })}
          </Dock>
        </div>

        {/* Right Action Suite (Desktop: sm and up) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Sandbox Role Switcher */}
          {isDemoMode && (
            <div
              className={`flex items-center gap-1 border p-1 rounded-xl text-xs ${isDark
                ? "bg-[#0d0d11] border-[#1f1f26]"
                : "bg-zinc-50 border-zinc-200"
                }`}
              aria-label="Sandbox Role Simulator"
            >
              <span
                className={`text-[9px] font-mono uppercase px-1.5 ${isDark ? "text-[#71717a]" : "text-zinc-400"
                  }`}
              >
                Role:
              </span>
              {(["member", "trainer", "admin"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => switchSandboxRole(role)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#dfff00] capitalize ${activeRole === role
                    ? "bg-[#1a1a22] text-[#dfff00] font-bold border border-[#2e2e38]"
                    : isDark
                      ? "text-[#a1a1aa] hover:text-[#f4f4f5]"
                      : "text-zinc-500 hover:text-[#0a0a0a]"
                    }`}
                  title={`Simulate ${role} view`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className={`w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] ${isDark
              ? "bg-[#0d0d11] border-[#1f1f26] text-[#a1a1aa] hover:text-[#dfff00] hover:border-[#dfff00]/30"
              : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-[#0a0a0a] hover:border-zinc-300"
              }`}
          >
            {isDark ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Primary CTA */}
          {isAuthenticated ? (
            <Link to={getDashboardPath(activeRole)}>
              <Button variant="volt" size="sm" className="gap-1.5">
                Portal <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="volt" size="sm" className="gap-1.5">
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" /> Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile controls: CTA icon + theme toggle + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Quick mobile access icon button (accessible CTA on narrowest screens) */}
          <Link
            to={isAuthenticated ? getDashboardPath(activeRole) : "/login"}
            className="sm:hidden"
            aria-label={isAuthenticated ? "Open Portal" : "Sign In"}
          >
            <button
              type="button"
              className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl bg-[#dfff00] text-[#08080a] font-bold flex items-center justify-center shadow-sm hover:brightness-105 active:scale-95 transition-transform"
              aria-label={isAuthenticated ? "Open Portal" : "Sign In"}
            >
              {isAuthenticated ? (
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              ) : (
                <LogIn className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </Link>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] transition-colors ${isDark
              ? "bg-[#0d0d11] border-[#1f1f26] text-[#a1a1aa] hover:text-[#dfff00]"
              : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-[#0a0a0a]"
              }`}
          >
            {isDark ? (
              <Sun className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          {/* Compact Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] transition-colors ${isDark
              ? "bg-[#0d0d11] border-[#1f1f26] text-[#f4f4f5] hover:border-[#2e2e38]"
              : "bg-zinc-50 border-zinc-200 text-[#0a0a0a] hover:border-zinc-300"
              }`}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[65px] bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className={`relative z-50 lg:hidden border-b px-5 py-5 space-y-4 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto ${isDark
            ? "border-[#1f1f26] bg-[#0d0d11]"
            : "border-zinc-200 bg-white"
            }`}
          role="region"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop(true);
                  }}
                  className={`flex items-center justify-between text-sm font-semibold py-3 px-3.5 min-h-[44px] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] ${isActive
                    ? isDark
                      ? "bg-[#121217] text-[#f4f4f5] border border-[#2e2e38]"
                      : "bg-zinc-100 text-[#0a0a0a] border border-zinc-200"
                    : isDark
                      ? "text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#121217]"
                      : "text-zinc-500 hover:text-[#0a0a0a] hover:bg-zinc-50"
                    }`}
                >
                  <span className="uppercase tracking-wider text-xs font-bold">{link.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#dfff00]" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          {isDemoMode && (
            <div
              className={`pt-4 border-t space-y-2.5 ${isDark ? "border-[#1f1f26]" : "border-zinc-200"
                }`}
            >
              <div
                className={`text-[11px] uppercase tracking-widest font-mono ${isDark ? "text-[#71717a]" : "text-zinc-400"
                  }`}
              >
                Simulate Portal Clearance:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["member", "trainer", "admin"] as UserRole[]).map((role) => (
                  <Button
                    key={role}
                    variant={activeRole === role ? "volt" : "secondary"}
                    size="sm"
                    className="min-h-[40px]"
                    onClick={() => {
                      switchSandboxRole(role);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div
            className={`pt-3 border-t ${isDark ? "border-[#1f1f26]" : "border-zinc-200"
              }`}
          >
            <Link
              to={isAuthenticated ? getDashboardPath(activeRole) : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button variant="volt" className="w-full min-h-[44px] font-bold">
                {isAuthenticated ? "Enter Application Portal" : "Sign In to IRONX"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
