import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { IronyxToaster } from "@/components/feedback/IronyxToaster";
import { IronyxCinematicLoader } from "@/components/feedback/IronyxCinematicLoader";
import { ThemeProvider } from "@/context/ThemeContext";
import { useLenis } from "@/hooks/useLenis";
import { router } from "./routes";
import { useGymStore } from "@/store/useGymStore";
import { useAuthStore } from "@/store/useAuthStore";
import { isFirebaseConfigured } from "@/services/firebase/firebase.config";

// ─── Session key ─────────────────────────────────────────────────────────────
// Loader shows once per browser session (survives navigation but not refresh).
const SESSION_KEY = "ironyx_session_loaded";

// ─── Inner app (needs to be inside ThemeProvider to use Lenis safely) ─────────
function AppInner() {
  useLenis(); // Initializes Lenis smooth scroll for entire app

  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  });

  useEffect(() => {
    // 1. Authoritative Firebase Authentication State Observer
    const unsubscribeAuth = useAuthStore.getState().initAuthListener();

    // 2. Background Firebase/Firestore synchronization (non-blocking)
    if (isFirebaseConfigured) {
      useGymStore.getState().syncWithFirestore().catch((err: unknown) => {
        console.warn(
          "[IRONX Boot] Cloud sync initialized with cached fallback:",
          err
        );
      });
    }

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (!isBootstrapping) return;

    sessionStorage.setItem(SESSION_KEY, "1");

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) setIsBootstrapping(false);
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isBootstrapping]);

  return (
    <>
      {/*
       * IronyxCinematicLoader renders via React Portal into document.body.
       * AnimatePresence lives inside the component — no wrapper needed here.
       */}
      <IronyxCinematicLoader isVisible={isBootstrapping} />
      <RouterProvider router={router} />
      <IronyxToaster />
    </>
  );
}

// ─── Root App — ThemeProvider must wrap everything ────────────────────────────
export function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
