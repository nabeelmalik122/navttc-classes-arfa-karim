import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiLock, FiPhone,
  FiEye, FiEyeOff, FiAlertCircle, FiUserPlus,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../context/AuthContext';

// ── Password strength indicator ────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ characters',  pass: password.length >= 6   },
    { label: 'Uppercase',       pass: /[A-Z]/.test(password) },
    { label: 'Number',          pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1 h-1">
        {[0, 1, 2].map((i) => (
          <div key={i}
            className={`flex-1 rounded-full transition-all duration-300
                        ${i < score ? colors[score - 1] : 'bg-white/15'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(({ label, pass }) => (
            <span key={label}
              className={`text-[10px] ${pass ? 'text-emerald-400' : 'text-offwhite/30'}`}>
              {pass ? '✓' : '○'} {label}
            </span>
          ))}
        </div>
        <span className={`text-[10px] font-medium ${colors[score - 1]?.replace('bg-', 'text-') ?? 'text-offwhite/30'}`}>
          {score > 0 ? labels[score - 1] : ''}
        </span>
      </div>
    </div>
  );
}

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

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name    = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim())           e.email   = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)               e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword)        e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
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
      const user = await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome to Urban Cuisine, ${user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
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
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80"
            alt="Urban Cuisine interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 overlay-dark" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-14 h-14 bg-gold rounded-sm flex items-center justify-center mb-5">
              <span className="font-heading font-bold text-charcoal text-2xl">U</span>
            </div>
            <h2 className="font-heading text-3xl text-offwhite mb-3">
              Join Urban Cuisine
            </h2>
            <p className="text-offwhite/55 text-sm leading-relaxed max-w-xs">
              Create an account to book tables online, track your orders, and enjoy exclusive member benefits.
            </p>
            <ul className="mt-6 space-y-2 text-left w-full max-w-xs">
              {[
                'Online reservation management',
                'Order history & tracking',
                'Exclusive member events',
                'Personalised recommendations',
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-offwhite/60 text-sm">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" /> {b}
                </li>
              ))}
            </ul>
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
              Create Account
            </p>
            <h1 className="font-heading text-3xl text-offwhite mb-2">
              Join Us Today
            </h1>
            <p className="text-offwhite/50 text-sm mb-8">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-gold-light underline-gold">
                Sign in
              </Link>
            </p>

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

            <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Registration form">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" error={errors.name} required>
                  <div className="relative">
                    <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                 text-offwhite/30 pointer-events-none" />
                    <input name="name" type="text" value={form.name} onChange={handleChange}
                      placeholder="Jane Smith" autoComplete="name" autoFocus
                      className={`input-base pl-10 ${errors.name ? 'border-red-400' : ''}`} />
                  </div>
                </Field>

                <Field label="Phone (optional)">
                  <div className="relative">
                    <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                   text-offwhite/30 pointer-events-none" />
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                      placeholder="+1 (555) 000-0000" autoComplete="tel"
                      className="input-base pl-10" />
                  </div>
                </Field>
              </div>

              <Field label="Email Address" error={errors.email} required>
                <div className="relative">
                  <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                               text-offwhite/30 pointer-events-none" />
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email"
                    className={`input-base pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                </div>
              </Field>

              <Field label="Password" error={errors.password} required>
                <div className="relative">
                  <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                               text-offwhite/30 pointer-events-none" />
                  <input name="password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={handleChange}
                    placeholder="At least 6 characters" autoComplete="new-password"
                    className={`input-base pl-10 pr-11 ${errors.password ? 'border-red-400' : ''}`} />
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-offwhite/35
                               hover:text-offwhite/70 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </Field>

              <Field label="Confirm Password" error={errors.confirmPassword} required>
                <div className="relative">
                  <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                               text-offwhite/30 pointer-events-none" />
                  <input name="confirmPassword" type="password"
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Repeat your password" autoComplete="new-password"
                    className={`input-base pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-xs">
                      ✓ Match
                    </span>
                  )}
                </div>
              </Field>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 gap-2 mt-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <><FiUserPlus size={16} /> Create Account</>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-offwhite/30">
              By registering you agree to our{' '}
              <span className="text-offwhite/50">Terms of Service</span> and{' '}
              <span className="text-offwhite/50">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
