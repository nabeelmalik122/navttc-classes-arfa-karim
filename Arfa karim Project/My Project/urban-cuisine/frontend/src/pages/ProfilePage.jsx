import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiPhone, FiLock, FiSave,
  FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-offwhite/70 mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [info, setInfo] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' });
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [infoErrors, setInfoErrors] = useState({});
  const [passErrors, setPassErrors] = useState({});
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);

  // ── Update profile info ────────────────────────────────────────────────────
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!info.name.trim()) e2.name = 'Name is required';
    if (Object.keys(e2).length) { setInfoErrors(e2); return; }

    setSavingInfo(true);
    try {
      const { data } = await api.put('/auth/profile', info);
      updateUser(data.data);
      toast.success('Profile updated');
      setInfoErrors({});
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSavingInfo(false);
    }
  };

  // ── Change password ────────────────────────────────────────────────────────
  const handlePassSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!pass.currentPassword) e2.currentPassword = 'Current password is required';
    if (!pass.newPassword)     e2.newPassword = 'New password is required';
    else if (pass.newPassword.length < 6) e2.newPassword = 'Must be at least 6 characters';
    if (pass.newPassword !== pass.confirmPassword) e2.confirmPassword = 'Passwords do not match';
    if (Object.keys(e2).length) { setPassErrors(e2); return; }

    setSavingPass(true);
    try {
      await api.put('/auth/profile', {
        currentPassword: pass.currentPassword,
        newPassword: pass.newPassword,
      });
      toast.success('Password changed successfully');
      setPass({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPassErrors({});
    } catch (err) {
      toast.error(err.message || 'Could not change password');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <PageLayout>
      <div className="section-pad">
        <div className="container-main px-4 sm:px-6 lg:px-8 max-w-3xl">

          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-gold/20 border border-gold/40 rounded-full
                            flex items-center justify-center text-gold text-2xl font-heading font-bold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-0.5">
                My Account
              </p>
              <h1 className="font-heading text-2xl text-offwhite">{user?.name}</h1>
              <p className="text-offwhite/45 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── Profile info form ────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card rounded-sm p-6"
              aria-label="Update profile information"
            >
              <h2 className="font-heading text-xl text-offwhite mb-5">
                Profile <span className="text-gold italic">Details</span>
              </h2>

              <form onSubmit={handleInfoSubmit} noValidate className="space-y-4">
                <Field label="Full Name" error={infoErrors.name}>
                  <div className="relative">
                    <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                 text-offwhite/30 pointer-events-none" />
                    <input name="name" type="text" value={info.name}
                      onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
                      className={`input-base pl-10 ${infoErrors.name ? 'border-red-400' : ''}`}
                      autoComplete="name"
                    />
                  </div>
                </Field>

                <Field label="Email Address">
                  <div className="relative opacity-60">
                    <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                 text-offwhite/30 pointer-events-none" />
                    <input type="email" value={user?.email ?? ''} disabled
                      className="input-base pl-10 cursor-not-allowed" />
                  </div>
                  <p className="mt-1 text-xs text-offwhite/30">Email cannot be changed</p>
                </Field>

                <Field label="Phone Number">
                  <div className="relative">
                    <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                   text-offwhite/30 pointer-events-none" />
                    <input name="phone" type="tel" value={info.phone}
                      onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="input-base pl-10"
                      autoComplete="tel"
                    />
                  </div>
                </Field>

                <div className="pt-2">
                  <button type="submit" disabled={savingInfo}
                    className="btn-primary gap-2 px-6">
                    {savingInfo ? (
                      <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    ) : (
                      <FiSave size={15} />
                    )}
                    {savingInfo ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.section>

            {/* ── Change password form ─────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="card rounded-sm p-6"
              aria-label="Change password"
            >
              <h2 className="font-heading text-xl text-offwhite mb-5">
                Change <span className="text-gold italic">Password</span>
              </h2>

              <form onSubmit={handlePassSubmit} noValidate className="space-y-4">
                <Field label="Current Password" error={passErrors.currentPassword}>
                  <div className="relative">
                    <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                 text-offwhite/30 pointer-events-none" />
                    <input name="currentPassword" type={showCurrent ? 'text' : 'password'}
                      value={pass.currentPassword}
                      onChange={(e) => setPass((p) => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="Your current password"
                      className={`input-base pl-10 pr-11 ${passErrors.currentPassword ? 'border-red-400' : ''}`}
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-offwhite/35
                                 hover:text-offwhite/70 transition-colors"
                      aria-label={showCurrent ? 'Hide' : 'Show'}>
                      {showCurrent ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </Field>

                <Field label="New Password" error={passErrors.newPassword}>
                  <div className="relative">
                    <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                 text-offwhite/30 pointer-events-none" />
                    <input name="newPassword" type={showNew ? 'text' : 'password'}
                      value={pass.newPassword}
                      onChange={(e) => setPass((p) => ({ ...p, newPassword: e.target.value }))}
                      placeholder="At least 6 characters"
                      className={`input-base pl-10 pr-11 ${passErrors.newPassword ? 'border-red-400' : ''}`}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-offwhite/35
                                 hover:text-offwhite/70 transition-colors"
                      aria-label={showNew ? 'Hide' : 'Show'}>
                      {showNew ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm New Password" error={passErrors.confirmPassword}>
                  <div className="relative">
                    <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                 text-offwhite/30 pointer-events-none" />
                    <input name="confirmPassword" type="password"
                      value={pass.confirmPassword}
                      onChange={(e) => setPass((p) => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Repeat new password"
                      className={`input-base pl-10 ${passErrors.confirmPassword ? 'border-red-400' : ''}`}
                      autoComplete="new-password"
                    />
                    {pass.confirmPassword && pass.newPassword === pass.confirmPassword && (
                      <FiCheckCircle size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2
                                                           text-emerald-400 pointer-events-none" />
                    )}
                  </div>
                </Field>

                <div className="pt-2">
                  <button type="submit" disabled={savingPass}
                    className="btn-outline gap-2 px-6">
                    {savingPass ? (
                      <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    ) : (
                      <FiLock size={15} />
                    )}
                    {savingPass ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.section>
          </div>

          {/* Account meta */}
          <div className="mt-8 p-5 border border-white/10 rounded-sm text-sm text-offwhite/35 flex
                          flex-wrap gap-x-8 gap-y-2">
            <span>Role: <span className="text-gold capitalize">{user?.role}</span></span>
            <span>Member since: <span className="text-offwhite/60">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—'}
            </span></span>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
