import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useLocation } from "react-router-dom";

export const scrollToTop = (smooth: boolean = true) => {
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  } catch {
    window.scrollTo(0, 0);
  }
};

/**
 * ScrollToTopHandler — Component that automatically scrolls to top on route changes
 * and provides a floating Back To Top button when scrolled down.
 */
export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top automatically when route changes
  useEffect(() => {
    scrollToTop(true);
  }, [pathname]);

  // Monitor scroll position to show/hide floating button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility(); // Check initial position

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    scrollToTop(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll back to top of page"
      title="Back to Top"
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-[#0d0d11]/90 backdrop-blur-md border border-[#272736] text-[#dfff00] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-[#dfff00] hover:bg-[#14141e] hover:shadow-[0_0_25px_rgba(223,255,0,0.35)] hover:scale-110 active:scale-95 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ChevronUp className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
    </button>
  );
};
