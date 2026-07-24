import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiSettings,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/reservations", label: "Reservations" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Navbar background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium tracking-wide transition-colors duration-200 underline-gold pb-0.5
     ${isActive ? "text-gold after:w-full" : "text-offwhite/80 hover:text-offwhite"}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-charcoal/95 backdrop-blur-md shadow-lg shadow-black/30"
            : "bg-transparent"
        }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between min-h-[72px] py-4 px-4 sm:px-6 lg:px-8">
          {/* ── Logo ────────────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Urban Cuisine home"
          >
            <div
              className="w-9 h-9 bg-gold rounded-sm flex items-center justify-center
                            group-hover:bg-gold-light transition-colors duration-200"
            >
              <span className="font-heading font-bold text-charcoal text-lg leading-none">
                U
              </span>
            </div>
            <span className="font-heading text-xl text-offwhite tracking-wide">
              Urban<span className="text-gold">Cuisine</span>
            </span>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────── */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={navLinkClass}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop actions ──────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative btn-ghost p-2"
              aria-label={`Cart (${itemCount} items)`}
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal
                                 text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              /* User dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 btn-ghost px-3 py-2"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div
                    className="w-8 h-8 bg-gold/20 border border-gold/40 rounded-full
                                  flex items-center justify-center text-gold text-sm font-semibold"
                  >
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm text-offwhite/80 max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`text-offwhite/60 transition-transform duration-200
                                ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-sm
                                 border border-white/10 shadow-xl shadow-black/40 overflow-hidden"
                      role="menu"
                    >
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gold
                                     hover:bg-white/5 transition-colors"
                          role="menuitem"
                        >
                          <FiSettings size={15} /> Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-offwhite/80
                                   hover:bg-white/5 hover:text-offwhite transition-colors"
                        role="menuitem"
                      >
                        <FiUser size={15} /> My Profile
                      </Link>
                      <Link
                        to="/my-reservations"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-offwhite/80
                                   hover:bg-white/5 hover:text-offwhite transition-colors"
                        role="menuitem"
                      >
                        <FiUser size={15} /> My Reservations
                      </Link>
                      <div className="border-t border-white/10" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400
                                   hover:bg-white/5 transition-colors"
                        role="menuitem"
                      >
                        <FiLogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Join Us
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile actions ───────────────────────────────────── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative btn-ghost p-2"
              aria-label={`Cart (${itemCount} items)`}
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-charcoal
                                 text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="btn-ghost p-2"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-charcoal/98 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <nav
              className="px-4 py-6 flex flex-col gap-1"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-sm text-base font-medium transition-colors
                     ${
                       isActive
                         ? "bg-gold/10 text-gold"
                         : "text-offwhite/80 hover:bg-white/5 hover:text-offwhite"
                     }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <div className="border-t border-white/10 mt-3 pt-4 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-gold hover:bg-white/5 rounded-sm"
                      >
                        <FiSettings size={16} /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/my-reservations"
                      className="flex items-center gap-2 px-4 py-3 text-offwhite/80 hover:bg-white/5 rounded-sm"
                    >
                      <FiUser size={16} /> My Reservations
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white/5 rounded-sm w-full text-left"
                    >
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-outline w-full text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary w-full text-center"
                    >
                      Join Us
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
