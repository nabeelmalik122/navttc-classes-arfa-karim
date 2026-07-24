import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../ui/CartDrawer';

// ── Floating WhatsApp button ───────────────────────────────────────────────────
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(true);

  // Show after 2 s, hide tooltip after 5 s
  useEffect(() => {
    const showTimer    = setTimeout(() => setVisible(true), 2000);
    const tooltipTimer = setTimeout(() => setTooltip(false), 7000);
    return () => { clearTimeout(showTimer); clearTimeout(tooltipTimer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
        >
          {/* Tooltip bubble */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="mb-1 glass border border-white/15 rounded-sm px-3 py-2
                           text-offwhite text-xs font-medium whitespace-nowrap shadow-xl"
              >
                💬 Chat with us on WhatsApp!
                <button
                  onClick={() => setTooltip(false)}
                  className="ml-2 text-offwhite/40 hover:text-offwhite leading-none"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Green WhatsApp circle button */}
          <motion.a
            href="https://wa.me/923079009095?text=Hi%20Urban%20Cuisine%2C%20I%27d%20like%20to%20enquire..."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp — 0307-9009095"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full flex items-center justify-center
                       shadow-2xl shadow-green-500/40"
            style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            onClick={() => setTooltip(false)}
          >
            {/* WhatsApp SVG icon (official shape) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-7 h-7 fill-white"
              aria-hidden="true"
            >
              <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.854 6.667L2.667 29.333l6.827-1.787A13.24 13.24 0 0 0 16.004 29.333c7.36 0 13.329-5.973 13.329-13.333 0-7.36-5.969-13.333-13.329-13.333zm0 24c-2.133 0-4.213-.56-6.026-1.627l-.427-.253-4.054 1.067 1.08-3.947-.28-.427A10.613 10.613 0 0 1 5.333 16c0-5.88 4.787-10.667 10.671-10.667C21.88 5.333 26.667 10.12 26.667 16S21.88 26.667 16.004 26.667zm5.84-7.987c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.987 1.253-.16.213-.373.24-.693.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.143-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.253-.613-.52-.533-.72-.547-.187-.013-.4-.013-.613-.013a1.19 1.19 0 0 0-.853.4c-.293.32-1.107 1.08-1.107 2.627s1.133 3.04 1.293 3.253c.16.213 2.227 3.4 5.387 4.773.747.32 1.333.513 1.787.66.747.24 1.427.2 1.96.12.6-.093 1.84-.747 2.107-1.48.267-.733.267-1.36.187-1.48-.08-.12-.293-.2-.613-.36z"/>
            </svg>
          </motion.a>

          {/* Pulse ring */}
          <span
            className="absolute bottom-0 right-0 w-14 h-14 rounded-full animate-ping"
            style={{ background: 'rgba(37,211,102,0.25)', pointerEvents: 'none' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Page shell ─────────────────────────────────────────────────────────────────
/**
 * Standard page shell: Navbar + main content + Footer + CartDrawer + FloatingWhatsApp.
 * All public and authenticated pages wrap their content in this.
 */
export default function PageLayout({ children, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col bg-charcoal">
      <Navbar />
      <main className={`flex-1 ${className}`} id="main-content">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
}
