import React from "react";
import { motion } from "framer-motion";
import { useReducedMotion, MOTION_TOKENS } from "@/utils/motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightClass?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  delay = 0,
  highlightWords = [],
  highlightClass = "text-[#dfff00]",
}) => {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return (
      <h1 className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}>
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
          const isHighlighted = highlightWords.some(
            (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
          );
          return (
            <span
              key={index}
              className={`font-black tracking-tight ${isHighlighted ? highlightClass : ""}`}
            >
              {word}
            </span>
          );
        })}
      </h1>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: MOTION_TOKENS.stagger.tight,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: MOTION_TOKENS.duration.reveal,
        ease: MOTION_TOKENS.ease.out,
      },
    },
  };

  return (
    <motion.h1
      className={`overflow-hidden flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
        const isHighlighted = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
        );

        return (
          <span key={index} className="inline-block overflow-hidden pb-1">
            <motion.span
              variants={wordVariants}
              className={`inline-block font-black tracking-tight ${
                isHighlighted ? highlightClass : ""
              }`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </motion.h1>
  );
};
