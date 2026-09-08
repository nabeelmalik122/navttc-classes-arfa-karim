import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { UnauthorizedState } from "@/components/feedback/UnauthorizedState";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, activeRole, isLoading } = useAuthStore();
  const location = useLocation();

  // 1. Loading State (e.g. verifying Firebase Auth identity & Firestore document)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080a]">
        <LoadingSpinner size="lg" label="Verifying access..." />
      </div>
    );
  }

  // 2. Unauthenticated Redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Unauthorized Role Access Validation (Admin has master override)
  if (
    allowedRoles &&
    !allowedRoles.includes(activeRole) &&
    activeRole !== "admin"
  ) {
    return <UnauthorizedState requiredRole={allowedRoles.join(" or ").toUpperCase()} />;
  }

  // 4. Authorized Access
  return <>{children}</>;
};
