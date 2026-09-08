import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { UnauthorizedState } from "@/components/feedback/UnauthorizedState";
import { NotFoundPage } from "@/components/feedback/NotFoundPage";

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const ProgramsPage = lazy(() => import("@/pages/public/ProgramsPage"));
const ClassesPage = lazy(() => import("@/pages/public/ClassesPage"));
const TrainersPage = lazy(() => import("@/pages/public/TrainersPage"));
const PricingPage = lazy(() => import("@/pages/public/PricingPage"));
const GalleryPage = lazy(() => import("@/pages/public/GalleryPage"));
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));

// Auth Pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));

// Member Portal Pages
const MemberDashboardPage = lazy(() => import("@/pages/member/MemberDashboardPage"));
const MemberBookingsPage = lazy(() => import("@/pages/member/MemberBookingsPage"));
const MemberWorkoutsPage = lazy(() => import("@/pages/member/MemberWorkoutsPage"));
const MemberProgressPage = lazy(() => import("@/pages/member/MemberProgressPage"));
const MemberMembershipPage = lazy(() => import("@/pages/member/MemberMembershipPage"));
const MemberSettingsPage = lazy(() => import("@/pages/member/MemberSettingsPage"));

// Trainer Portal Pages
const TrainerDashboardPage = lazy(() => import("@/pages/trainer/TrainerDashboardPage"));
const TrainerClassesPage = lazy(() => import("@/pages/trainer/TrainerClassesPage"));
const TrainerClientsPage = lazy(() => import("@/pages/trainer/TrainerClientsPage"));
const TrainerWorkoutsPage = lazy(() => import("@/pages/trainer/TrainerWorkoutsPage"));
const TrainerSchedulePage = lazy(() => import("@/pages/trainer/TrainerSchedulePage"));
const TrainerSettingsPage = lazy(() => import("@/pages/trainer/TrainerSettingsPage"));

// Admin Portal Pages
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminMembersPage = lazy(() => import("@/pages/admin/AdminMembersPage"));
const AdminTrainersPage = lazy(() => import("@/pages/admin/AdminTrainersPage"));
const AdminClassesPage = lazy(() => import("@/pages/admin/AdminClassesPage"));
const AdminBookingsPage = lazy(() => import("@/pages/admin/AdminBookingsPage"));
const AdminPlansPage = lazy(() => import("@/pages/admin/AdminPlansPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminReviewsPage = lazy(() => import("@/pages/admin/AdminReviewsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));

// Standardized Page Suspense Fallback
const PageFallback = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#08080a]">
    <LoadingSpinner size="lg" label="Loading..." />
  </div>
);

const suspenseWrap = (Component: React.ComponentType) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: suspenseWrap(HomePage) },
      { path: "about", element: suspenseWrap(AboutPage) },
      { path: "programs", element: suspenseWrap(ProgramsPage) },
      { path: "classes", element: suspenseWrap(ClassesPage) },
      { path: "trainers", element: suspenseWrap(TrainersPage) },
      { path: "pricing", element: suspenseWrap(PricingPage) },
      { path: "gallery", element: suspenseWrap(GalleryPage) },
      { path: "contact", element: suspenseWrap(ContactPage) },
      { path: "unauthorized", element: <UnauthorizedState /> },
    ],
  },

  // ==========================================
  // AUTHENTICATION ROUTES (STANDARDIZED)
  // ==========================================
  { path: "/login", element: suspenseWrap(LoginPage) },
  { path: "/register", element: suspenseWrap(RegisterPage) },
  { path: "/forgot-password", element: suspenseWrap(ForgotPasswordPage) },
  { path: "/reset-password", element: suspenseWrap(ResetPasswordPage) },

  // Legacy auth redirects for backwards compatibility
  { path: "/auth/login", element: <Navigate to="/login" replace /> },
  { path: "/auth/register", element: <Navigate to="/register" replace /> },
  { path: "/auth/forgot-password", element: <Navigate to="/forgot-password" replace /> },
  { path: "/auth/reset-password", element: <Navigate to="/reset-password" replace /> },

  // ==========================================
  // MEMBER PORTAL (ROLE-PROTECTED: MEMBER | ADMIN)
  // ==========================================
  {
    path: "/member",
    element: (
      <ProtectedRoute allowedRoles={["member", "admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/member/dashboard" replace /> },
      { path: "dashboard", element: suspenseWrap(MemberDashboardPage) },
      { path: "bookings", element: suspenseWrap(MemberBookingsPage) },
      { path: "workouts", element: suspenseWrap(MemberWorkoutsPage) },
      { path: "progress", element: suspenseWrap(MemberProgressPage) },
      { path: "membership", element: suspenseWrap(MemberMembershipPage) },
      { path: "settings", element: suspenseWrap(MemberSettingsPage) },
    ],
  },

  // ==========================================
  // TRAINER PORTAL (ROLE-PROTECTED: TRAINER | ADMIN)
  // ==========================================
  {
    path: "/trainer",
    element: (
      <ProtectedRoute allowedRoles={["trainer", "admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/trainer/dashboard" replace /> },
      { path: "dashboard", element: suspenseWrap(TrainerDashboardPage) },
      { path: "classes", element: suspenseWrap(TrainerClassesPage) },
      { path: "clients", element: suspenseWrap(TrainerClientsPage) },
      { path: "workouts", element: suspenseWrap(TrainerWorkoutsPage) },
      { path: "schedule", element: suspenseWrap(TrainerSchedulePage) },
      { path: "settings", element: suspenseWrap(TrainerSettingsPage) },
    ],
  },

  // ==========================================
  // ADMIN PORTAL (ROLE-PROTECTED: ADMIN ONLY)
  // ==========================================
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: suspenseWrap(AdminDashboardPage) },
      { path: "members", element: suspenseWrap(AdminMembersPage) },
      { path: "trainers", element: suspenseWrap(AdminTrainersPage) },
      { path: "classes", element: suspenseWrap(AdminClassesPage) },
      { path: "bookings", element: suspenseWrap(AdminBookingsPage) },
      { path: "plans", element: suspenseWrap(AdminPlansPage) },
      { path: "analytics", element: suspenseWrap(AdminAnalyticsPage) },
      { path: "reviews", element: suspenseWrap(AdminReviewsPage) },
      { path: "settings", element: suspenseWrap(AdminSettingsPage) },
    ],
  },

  // ==========================================
  // 404 NOT FOUND CATCH-ALL
  // ==========================================
  {
    path: "*",
    element: suspenseWrap(NotFoundPage),
  },
]);
