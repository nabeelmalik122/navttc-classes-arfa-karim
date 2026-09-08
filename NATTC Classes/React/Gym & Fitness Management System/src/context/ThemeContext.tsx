import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "ironyx-theme";

/** Reads user preference: localStorage → system preference → dark (brand default) */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;

  // System preference fallback
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";

  // Brand default: dark
  return "dark";
}

/** Applies theme class to <html> and updates meta theme-color */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    if (metaThemeColor) metaThemeColor.setAttribute("content", "#09090b");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    if (metaThemeColor) metaThemeColor.setAttribute("content", "#f8f9fa");
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply on mount + whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}

export default ThemeProvider;
