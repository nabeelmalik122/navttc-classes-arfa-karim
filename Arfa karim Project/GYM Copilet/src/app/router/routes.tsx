import { createBrowserRouter, Navigate } from 'react-router-dom';
import { APP_ROUTES } from '@/core/config/constants';

// Layouts
import { MarketingLayout } from './layouts/MarketingLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { TrainerLayout } from './layouts/TrainerLayout';
import { MemberLayout } from './layouts/MemberLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Guards
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';

// Feature Pages (Shells)
import { LandingPage, PricingPage, FeaturesPage, LocationsPage } from '@/features/marketing';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/features/auth';
import { AdminDashboardPage, AdminAnalyticsPage } from '@/features/analytics';
import { AdminMembersPage, MemberDetailPage, MemberPortalDashboardPage, MemberProfilePage } from '@/features/members';
import { AdminSchedulePage, MemberClassesPage, MemberBookingsPage, TrainerSchedulePage } from '@/features/classes';
import { TrainerProgramsPage, TrainerClientsPage, MemberTrackerPage } from '@/features/workouts';
import { AdminStaffPage } from '@/features/settings';

export const router = createBrowserRouter([
  // 1. Public Marketing Routes
  {
    element: <MarketingLayout />,
    children: [
      { path: APP_ROUTES.HOME, element: <LandingPage /> },
      { path: APP_ROUTES.CLASSES, element: <FeaturesPage /> },
      { path: APP_ROUTES.TRAINERS, element: <LocationsPage /> },
      { path: APP_ROUTES.PRICING, element: <PricingPage /> },
      { path: APP_ROUTES.CONTACT, element: <LocationsPage /> },
    ],
  },

  // 2. Authentication Flow
  {
    element: <AuthLayout />,
    children: [
      { path: APP_ROUTES.LOGIN, element: <LoginPage /> },
      { path: APP_ROUTES.REGISTER, element: <RegisterPage /> },
      { path: APP_ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
    ],
  },

  // 3. Protected Portals
  {
    element: <AuthGuard />,
    children: [
      // A. Admin Dashboard (Role: admin)
      {
        path: APP_ROUTES.ADMIN_DASHBOARD,
        element: <RoleGuard allowedRoles={['admin']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'members', element: <AdminMembersPage /> },
              { path: 'members/:id', element: <MemberDetailPage /> },
              { path: 'classes', element: <AdminSchedulePage /> },
              { path: 'trainers', element: <AdminStaffPage /> },
              { path: 'analytics', element: <AdminAnalyticsPage /> },
            ],
          },
        ],
      },

      // B. Trainer Portal (Role: trainer)
      {
        path: APP_ROUTES.TRAINER_DASHBOARD,
        element: <RoleGuard allowedRoles={['trainer']} />,
        children: [
          {
            element: <TrainerLayout />,
            children: [
              { index: true, element: <TrainerSchedulePage /> },
              { path: 'schedule', element: <TrainerSchedulePage /> },
              { path: 'clients', element: <TrainerClientsPage /> },
              { path: 'workouts', element: <TrainerProgramsPage /> },
            ],
          },
        ],
      },

      // C. Member Portal (Role: member)
      {
        path: APP_ROUTES.MEMBER_DASHBOARD,
        element: <RoleGuard allowedRoles={['member']} />,
        children: [
          {
            element: <MemberLayout />,
            children: [
              { index: true, element: <MemberPortalDashboardPage /> },
              { path: 'classes', element: <MemberClassesPage /> },
              { path: 'bookings', element: <MemberBookingsPage /> },
              { path: 'workouts', element: <MemberTrackerPage /> },
              { path: 'profile', element: <MemberProfilePage /> },
            ],
          },
        ],
      },
    ],
  },

  // Wildcard Fallback
  {
    path: '*',
    element: <Navigate to={APP_ROUTES.HOME} replace />,
  },
]);
