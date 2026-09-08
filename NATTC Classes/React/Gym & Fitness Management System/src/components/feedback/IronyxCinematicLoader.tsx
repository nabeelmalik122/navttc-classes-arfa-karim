import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from "./IronyxCinematicLoader.module.css";

export interface IronyxCinematicLoaderProps {
  /** Controls whether the loader is visible. When false, exit animation plays then unmounts. */
  isVisible: boolean;
}

export const IronyxCinematicLoader: React.FC<IronyxCinematicLoaderProps> = ({
  isVisible,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Scroll-lock: prevent body scroll while loader is visible
  useEffect(() => {
    if (isVisible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isVisible]);

  const loaderNode = (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="ironyx-cinematic-loader"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading IRONX platform"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: shouldReduceMotion ? 0.1 : 0.45,
              ease: "easeInOut",
            },
          }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.35 }}
          className={styles.overlay}
        >
          {/* Screen-reader only label */}
          <span className="sr-only">Loading IRONX platform…</span>

          {/* Uiverse loader */}
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className={styles.loaderWrapper}
          >
            <div className={styles.loader} aria-hidden="true">
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.text}><span>Loading</span></div>
              <div className={styles.line}></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal: render directly into document.body to escape any parent
  // transform/filter/stacking context that would break position:fixed
  return createPortal(loaderNode, document.body);
};

export default IronyxCinematicLoader;
