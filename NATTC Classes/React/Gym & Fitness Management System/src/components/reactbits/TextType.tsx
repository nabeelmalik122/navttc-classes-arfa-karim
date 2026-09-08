/**
 * TextType — React Bits inspired typewriter effect component.
 * Cycles through an array of texts with typing/deleting animation.
 * Cursor blinks between phrases.
 */

import React, { useState, useEffect, useRef } from "react";

interface TextTypeProps {
  text: string[];           // Array of strings to cycle through
  typingSpeed?: number;     // ms per character (typing)
  deletingSpeed?: number;   // ms per character (deleting)
  pauseDuration?: number;   // ms to pause after fully typed
  showCursor?: boolean;
  cursorCharacter?: string;
  className?: string;
  cursorClassName?: string;
  loop?: boolean;
}

export const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 40,
  deletingSpeed = 20,
  pauseDuration = 3000,
  showCursor = true,
  cursorCharacter = "_",
  className = "",
  cursorClassName = "",
  loop = true,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [textIndex, setTextIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Cursor blink
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, [showCursor]);

  useEffect(() => {
    if (text.length === 0) return;

    // If reduced motion, just show first text instantly
    if (prefersReduced.current) {
      setDisplayed(text[0]);
      return;
    }

    const currentText = text[textIndex % text.length];

    if (phase === "typing") {
      if (displayed.length < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("pausing"), pauseDuration);
      }
    } else if (phase === "pausing") {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, deletingSpeed);
      } else {
        const nextIndex = textIndex + 1;
        if (!loop && nextIndex >= text.length) return;
        setTextIndex(nextIndex % text.length);
        setPhase("typing");
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, textIndex, text, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          className={cursorClassName}
          style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
          aria-hidden="true"
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

export default TextType;
