import React, { Component, type ReactNode } from 'react';
import { normalizeError } from '@/core/errors/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in UI boundary:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const normalized = normalizeError(this.state.error);
      return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-[#070709] text-white">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#0D0E12] border border-[#232533] text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FF3366]/20 flex items-center justify-center text-[#FF3366] font-bold">
              !
            </div>
            <h2 className="text-xl font-bold mb-2">Application Boundary Error</h2>
            <p className="text-sm text-[#9EA3B5] mb-4">{normalized.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#CCFF00] text-black font-semibold rounded-lg text-sm"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
