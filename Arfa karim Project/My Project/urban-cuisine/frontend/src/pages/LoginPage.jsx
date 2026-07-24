import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiAlertCircle, FiLogIn,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../context/AuthContext';

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-offwhite/70 mb-1.5">
        {label}{required && <span className="text-gold ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname ?? '/';

  const [form, setForm]         = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password.trim()) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setApiError('');
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      // Admins go directly to admin panel, regular users go to previous page or home
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-80px)] flex">

        {/* Left image panel (desktop) */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop&q=80"
            alt="Urban Cuisine fine dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 overlay-dark" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-14 h-14 bg-gold rounded-sm flex items-center justify-center mb-5">
              <span className="font-heading font-bold text-charcoal text-2xl">U</span>
            </div>
            <h2 className="font-heading text-3xl text-offwhite mb-3">
              Welcome Back
            </h2>
            <p className="text-offwhite/55 text-sm leading-relaxed max-w-xs">
              Sign in to manage your reservations, track your orders, and enjoy a personalised experience.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center px-4 py-16 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-gold rounded-sm flex items-center justify-center">
                <span className="font-heading font-bold text-charcoal text-lg">U</span>
              </div>
              <span className="font-heading text-xl text-offwhite">
                Urban<span className="text-gold">Cuisine</span>
              </span>
            </div>

            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Sign In
            </p>
            <h1 className="font-heading text-3xl text-offwhite mb-2">
              Welcome Back
            </h1>
            <p className="text-offwhite/50 text-sm mb-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-light underline-gold">
                Create one
              </Link>
            </p>

            {/* Admin hint */}
            <div className="bg-gold/5 border border-gold/20 rounded-sm px-4 py-3 mb-6 text-xs text-offwhite/50">
              <span className="text-gold font-semibold">Admin?</span> Login with your admin credentials — you'll be taken directly to the Admin Panel.
            </div>

            {/* API error banner */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-red-500/10 border border-red-500/30
                           text-red-400 text-sm px-4 py-3 rounded-sm mb-6"
                role="alert"
              >
                <FiAlertCircle size={16} className="shrink-0" />
                {apiError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Login form">
              <Field label="Email Address" error={errors.email} required>
                <div className="relative">
                  <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                               text-offwhite/30 pointer-events-none" />
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email" autoFocus
                    className={`input-base pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                </div>
              </Field>

              <Field label="Password" error={errors.password} required>
                <div className="relative">
                  <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                               text-offwhite/30 pointer-events-none" />
                  <input name="password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••" autoComplete="current-password"
                    className={`input-base pl-10 pr-11 ${errors.password ? 'border-red-400' : ''}`} />
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-offwhite/35
                               hover:text-offwhite/70 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </Field>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <><FiLogIn size={16} /> Sign In</>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-offwhite/30">
              By signing in you agree to our{' '}
              <span className="text-offwhite/50">Terms of Service</span> and{' '}
              <span className="text-offwhite/50">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
