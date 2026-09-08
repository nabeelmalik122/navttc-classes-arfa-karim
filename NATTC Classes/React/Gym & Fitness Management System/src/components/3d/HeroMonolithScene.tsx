import React, { useState, useEffect, Suspense, lazy, Component, type ErrorInfo } from "react";
import { useReducedMotion } from "@/utils/motion";

const DynamicMonolithCanvas = lazy(() => import("./DynamicMonolithCanvas"));

/**
 * WebGL Capability Detector
 */
function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * ErrorBoundary to isolate WebGL context failures without breaking UI
 */
class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("[IRONYX 3D] WebGL Canvas encountered an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Static Kinetic Fallback for WebGL-disabled or Reduced-Motion devices
 */
function StaticMonolithFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative pointer-events-none select-none">
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Outer Glowing Wireframe Octagon */}
        <div className="absolute inset-0 border border-[#dfff00]/30 rounded-3xl rotate-45 animate-pulse duration-[4000ms]" />
        <div className="absolute inset-4 border border-[#dfff00]/20 rounded-3xl -rotate-12" />
        
        {/* Inner Solid Kinetic Monolith Shield */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-br from-[#1c1c24] via-[#121217] to-[#08080a] border border-[#2e2e38] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl border border-[#dfff00]/40 flex items-center justify-center bg-[#dfff00]/5 shadow-[0_0_20px_rgba(223,255,0,0.15)]">
            <span className="text-xs font-black font-heading text-[#dfff00] tracking-widest uppercase">
              VTX
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const HeroMonolithScene: React.FC<{ className?: string }> = ({ className = "" }) => {
  const prefersReduced = useReducedMotion();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  return (
    <div className={`w-full h-full min-h-[380px] sm:min-h-[480px] relative ${className}`}>
      {prefersReduced || !hasWebGL ? (
        <StaticMonolithFallback />
      ) : (
        <WebGLErrorBoundary fallback={<StaticMonolithFallback />}>
          <Suspense fallback={<StaticMonolithFallback />}>
            <DynamicMonolithCanvas />
          </Suspense>
        </WebGLErrorBoundary>
      )}

      {/* Subtle Restrained Radial Backlight */}
      <div className="absolute inset-0 bg-radial from-[#dfff00]/5 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />
    </div>
  );
};

