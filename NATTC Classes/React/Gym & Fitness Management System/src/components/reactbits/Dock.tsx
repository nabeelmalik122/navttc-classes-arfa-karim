import React, { createContext, useContext, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import "./Dock.css";

interface DockContextValue {
  mouseX: MotionValue<number>;
  distance: number;
  maxScale: number;
}

const DockContext = createContext<DockContextValue | null>(null);

export interface DockProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  baseItemSize?: number;
  magnification?: number;
  maxScale?: number;
}

export const Dock: React.FC<DockProps> = ({
  children,
  className = "",
  distance = 130,
  baseItemSize = 40,
  magnification = 48,
  maxScale: explicitMaxScale,
}) => {
  const mouseX = useMotionValue(Infinity);
  // Calculate max scale factor from base size and magnification (e.g. 48/40 = 1.20)
  const computedMaxScale = explicitMaxScale ?? (magnification > baseItemSize ? magnification / baseItemSize : 1.18);

  return (
    <DockContext.Provider value={{ mouseX, distance, maxScale: computedMaxScale }}>
      <nav
        aria-label="Main Navigation"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`dock-panel ${className}`}
      >
        {children}
      </nav>
    </DockContext.Provider>
  );
};

export interface DockItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DockItem: React.FC<DockItemProps> = ({
  children,
  className = "",
  style = {},
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(DockContext);

  if (!context) {
    return <div className={`dock-item ${className}`} style={style}>{children}</div>;
  }

  const { mouseX, distance, maxScale } = context;

  // Proximity-based calculation: difference between cursor X and item center
  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    const elementCenter = bounds.x + bounds.width / 2;
    return val - elementCenter;
  });

  // Scale smoothly falls off within [-distance, distance]
  const scaleSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [1, maxScale, 1]
  );

  // Smooth spring physics for macOS dock-like tactile feedback
  const scale = useSpring(scaleSync, {
    mass: 0.1,
    stiffness: 200,
    damping: 15,
  });

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        transformOrigin: "center center",
        ...style,
      }}
      className={`dock-item ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Dock;
