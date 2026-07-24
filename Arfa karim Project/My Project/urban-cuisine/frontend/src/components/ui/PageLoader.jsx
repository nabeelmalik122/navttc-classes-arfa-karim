import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Full-screen branded loader shown on first visit / hard refresh.
 * Fades out after the app is ready (minimum 1.8 s for polish).
 *
 * Usage: wrap your <App /> content with <PageLoader> in main.jsx
 */
export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar 0 → 100 over ~1.6 s
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        // Small pause at 100 % before dismissing
        setTimeout(() => setLoading(false), 300);
      }
      setProgress(p);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0e0e0e]"
            aria-label="Loading Urban Cuisine"
            role="status"
          >
            {/* Background subtle pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #C9A227 0, #C9A227 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Centre content */}
            <div className="relative flex flex-col items-center gap-6">

              {/* Logo mark */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-3"
              >
                {/* Gold square logo */}
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-sm border-2 border-gold/30"
                    style={{ margin: '-6px' }}
                  />
                  <div className="w-16 h-16 bg-gold rounded-sm flex items-center justify-center shadow-lg shadow-gold/20">
                    <span className="font-heading font-bold text-charcoal text-3xl leading-none select-none">
                      U
                    </span>
                  </div>
                </div>

                {/* Brand name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-center"
                >
                  <p className="font-heading text-2xl text-offwhite tracking-wide">
                    Urban<span className="text-gold">Cuisine</span>
                  </p>
                  <p className="text-offwhite/30 text-xs uppercase tracking-[0.25em] mt-1">
                    Fine Dining · Nowshera
                  </p>
                </motion.div>
              </motion.div>

              {/* Progress bar */}
              <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                />
              </div>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 bg-gold/60 rounded-full"
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children (hidden under loader until dismissed) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
