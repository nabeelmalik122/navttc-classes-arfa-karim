import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { MOTION_TOKENS, useReducedMotion } from "@/utils/motion";

export interface SectionRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article";
}

/**
 * Reusable Level 2 Section Reveal Primitive.
 * 
 * Provides subtle opacity + vertical deceleration for meaningful section entries.
 * Automatically bypassed when prefers-reduced-motion is active.
 */
export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  className = "",
  as = "div",
  ...props
}) => {
  const prefersReduced = useReducedMotion();
  const MotionComponent = motion[as] as typeof motion.div;

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: MOTION_TOKENS.duration.reveal,
        delay,
        ease: MOTION_TOKENS.ease.out,
      }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
