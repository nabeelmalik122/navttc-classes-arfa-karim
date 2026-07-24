import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages (stubs replaced step by step)
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservationsPage from './pages/ReservationsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';

// ── Route guards ──────────────────────────────────────────────────────────────

/** Redirects unauthenticated users to /login */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/** Redirects non-admins to home */
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return isAdmin ? children : <Navigate to="/" replace />;
};

/** Redirects already-logged-in users away from auth pages */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// ── Full-page spinner (shown during auth verification) ────────────────────────
const FullPageSpinner = () => (
  <div className="min-h-screen bg-charcoal flex items-center justify-center">
    <div className="spinner" aria-label="Loading" />
  </div>
);

// ── App shell ─────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<HomePage />} />
    <Route path="/menu" element={<MenuPage />} />
    <Route path="/reservations" element={<ReservationsPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />

    {/* Auth (redirect if already logged in) */}
    <Route
      path="/login"
      element={
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicOnlyRoute>
          <RegisterPage />
        </PublicOnlyRoute>
      }
    />

    {/* Protected — logged-in users */}
    <Route
      path="/my-reservations"
      element={
        <PrivateRoute>
          <ReservationsPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      }
    />

    {/* Admin only */}
    <Route
      path="/admin/*"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />

    {/* 404 fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#252525',
              color: '#F8F5F0',
              border: '1px solid rgba(201,162,39,0.3)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#C9A227', secondary: '#1A1A1A' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#F8F5F0' },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
