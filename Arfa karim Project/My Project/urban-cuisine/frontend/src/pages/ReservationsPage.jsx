import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiCalendar, FiClock, FiUsers, FiUser, FiMail, FiPhone,
  FiMessageSquare, FiCheckCircle, FiAlertCircle, FiX,
  FiArrowRight, FiEdit3,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate, formatDateShort } from '../utils/format';

// ── Config ─────────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
];

const OCCASIONS = [
  { value: 'none',        label: 'No special occasion' },
  { value: 'birthday',    label: '🎂 Birthday'          },
  { value: 'anniversary', label: '💍 Anniversary'       },
  { value: 'business',    label: '💼 Business Dinner'   },
  { value: 'date',        label: '❤️  Date Night'       },
  { value: 'other',       label: '🎉 Other'              },
];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'badge-gold'  },
  confirmed: { label: 'Confirmed', color: 'badge-green' },
  cancelled: { label: 'Cancelled', color: 'badge-red'   },
  completed: { label: 'Completed', color: 'badge-blue'  },
};

const EMPTY_FORM = {
  name: '', email: '', phone: '', date: '', time: '',
  guests: '2', occasion: 'none', specialRequests: '',
};

// Minimum date = tomorrow
const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-offwhite/70 mb-1.5">
        {label}{required && <span className="text-gold ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ── My Reservations card ────────────────────────────────────────────────────────
function ReservationCard({ reservation, onCancel }) {
  const cfg = STATUS_CONFIG[reservation.status] ?? STATUS_CONFIG.pending;
  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="card rounded-sm p-5 flex flex-col sm:flex-row gap-4"
    >
      {/* Date block */}
      <div className="flex-shrink-0 text-center bg-gold/10 border border-gold/20
                      rounded-sm px-5 py-4 sm:w-24">
        <p className="text-gold font-heading text-2xl font-bold leading-none">
          {new Date(reservation.date).getDate()}
        </p>
        <p className="text-offwhite/50 text-xs uppercase tracking-wider mt-1">
          {new Date(reservation.date).toLocaleString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="text-offwhite font-semibold">{reservation.name}</p>
            <p className="text-offwhite/50 text-sm">{reservation.time} · {reservation.guests} guests</p>
          </div>
          <span className={cfg.color}>{cfg.label}</span>
        </div>
        {reservation.occasion !== 'none' && (
          <p className="text-offwhite/40 text-sm mb-1 capitalize">
            {OCCASIONS.find((o) => o.value === reservation.occasion)?.label ?? reservation.occasion}
          </p>
        )}
        {reservation.specialRequests && (
          <p className="text-offwhite/35 text-xs italic truncate">
            "{reservation.specialRequests}"
          </p>
        )}
      </div>

      {/* Actions */}
      {canCancel && (
        <button
          onClick={() => onCancel(reservation._id)}
          className="self-start sm:self-center flex items-center gap-1.5 text-xs text-red-400
                     hover:text-red-300 border border-red-400/30 hover:border-red-300
                     px-3 py-2 rounded-sm transition-colors shrink-0"
        >
          <FiX size={12} /> Cancel
        </button>
      )}
    </motion.article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ReservationsPage() {
  const { isAuthenticated, user } = useAuth();

  // Form state
  const [form, setForm]         = useState(() => ({
    ...EMPTY_FORM,
    name:  user?.name  ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  }));
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  // My reservations
  const [myReservations, setMyReservations] = useState([]);
  const [loadingMy, setLoadingMy]           = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchMyReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchMyReservations = async () => {
    setLoadingMy(true);
    try {
      const { data } = await api.get('/reservations/my');
      setMyReservations(data.data);
    } catch {
      // silently fail — user sees empty state
    } finally {
      setLoadingMy(false);
    }
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name   = 'Full name is required';
    if (!form.email.trim())       e.email  = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim())       e.phone  = 'Phone number is required';
    if (!form.date)               e.date   = 'Please select a date';
    if (!form.time)               e.time   = 'Please select a time slot';
    if (!form.guests || form.guests < 1) e.guests = 'At least 1 guest required';
    if (form.guests > 20)         e.guests = 'Maximum 20 guests';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstErrKey}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/reservations', {
        ...form,
        guests: parseInt(form.guests, 10),
      });
      setConfirmData(data.data);
      setSubmitted(true);
      toast.success('Reservation submitted! We\'ll confirm shortly.');
      if (isAuthenticated) fetchMyReservations();
    } catch (err) {
      toast.error(err.message || 'Could not submit reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await api.put(`/reservations/${id}/cancel`);
      toast.success('Reservation cancelled');
      setMyReservations((prev) =>
        prev.map((r) => r._id === id ? { ...r, status: 'cancelled' } : r)
      );
    } catch (err) {
      toast.error(err.message || 'Could not cancel reservation');
    }
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM, name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' });
    setErrors({});
    setSubmitted(false);
    setConfirmData(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PageLayout>

      {/* Hero */}
      <section className="relative h-64 sm:h-72 flex items-end overflow-hidden" aria-label="Reservations hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&auto=format&fit=crop&q=80"
            alt="Elegant table setting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 overlay-dark" />
        </div>
        <div className="relative z-10 container-main px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Dine With Us
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl text-offwhite">
            Make a <span className="text-gold italic">Reservation</span>
          </motion.h1>
        </div>
      </section>

      <div className="section-pad">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── LEFT: Form / Success ──────────────────────────── */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">

                {/* Success state */}
                {submitted && confirmData ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 px-6 card rounded-sm"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
                      className="w-20 h-20 bg-gold/15 rounded-full flex items-center justify-center
                                 mx-auto mb-6 border border-gold/30"
                    >
                      <FiCheckCircle size={36} className="text-gold" />
                    </motion.div>
                    <h2 className="font-heading text-2xl text-offwhite mb-3">
                      Reservation Received!
                    </h2>
                    <p className="text-offwhite/60 mb-6 max-w-md mx-auto">
                      Thank you, <span className="text-offwhite font-medium">{confirmData.name}</span>.
                      Your table for <span className="text-gold font-medium">{confirmData.guests} guests</span> on{' '}
                      <span className="text-gold font-medium">{formatDate(confirmData.date)}</span> at{' '}
                      <span className="text-gold font-medium">{confirmData.time}</span> is now <strong>pending confirmation</strong>.
                      We'll reach out to {confirmData.email} shortly.
                    </p>

                    {/* Summary card */}
                    <div className="bg-white/5 border border-white/10 rounded-sm p-5 text-left
                                    max-w-sm mx-auto mb-8 space-y-2 text-sm">
                      {[
                        { label: 'Name',   value: confirmData.name },
                        { label: 'Date',   value: formatDateShort(confirmData.date) },
                        { label: 'Time',   value: confirmData.time },
                        { label: 'Guests', value: confirmData.guests },
                        { label: 'Status', value: 'Pending confirmation' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-offwhite/45">{label}</span>
                          <span className="text-offwhite font-medium">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button onClick={resetForm} className="btn-outline gap-2">
                        <FiEdit3 size={15} /> New Reservation
                      </button>
                      <Link to="/menu" className="btn-primary gap-2">
                        Explore Menu <FiArrowRight size={15} />
                      </Link>
                    </div>
                  </motion.div>

                ) : (

                  /* Form */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label="Reservation form"
                  >
                    <h2 className="font-heading text-2xl text-offwhite mb-6">
                      Book Your Table
                    </h2>

                    {/* ── Guest details ──────────────────────────── */}
                    <fieldset className="mb-7">
                      <legend className="text-xs font-semibold uppercase tracking-widest
                                         text-gold mb-4">
                        Guest Details
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Field label="Full Name" error={errors.name} required>
                          <div className="relative">
                            <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                          text-offwhite/30 pointer-events-none" />
                            <input id="field-name" name="name" type="text"
                              value={form.name} onChange={handleChange}
                              placeholder="Jane Smith"
                              className={`input-base pl-10 ${errors.name ? 'border-red-400' : ''}`}
                              autoComplete="name"
                            />
                          </div>
                        </Field>

                        <Field label="Email" error={errors.email} required>
                          <div className="relative">
                            <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                          text-offwhite/30 pointer-events-none" />
                            <input id="field-email" name="email" type="email"
                              value={form.email} onChange={handleChange}
                              placeholder="jane@example.com"
                              className={`input-base pl-10 ${errors.email ? 'border-red-400' : ''}`}
                              autoComplete="email"
                            />
                          </div>
                        </Field>

                        <Field label="Phone Number" error={errors.phone} required>
                          <div className="relative">
                            <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                           text-offwhite/30 pointer-events-none" />
                            <input id="field-phone" name="phone" type="tel"
                              value={form.phone} onChange={handleChange}
                              placeholder="+1 (555) 000-0000"
                              className={`input-base pl-10 ${errors.phone ? 'border-red-400' : ''}`}
                              autoComplete="tel"
                            />
                          </div>
                        </Field>

                        <Field label="Number of Guests" error={errors.guests} required>
                          <div className="relative">
                            <FiUsers size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                           text-offwhite/30 pointer-events-none" />
                            <input id="field-guests" name="guests" type="number"
                              min={1} max={20}
                              value={form.guests} onChange={handleChange}
                              className={`input-base pl-10 ${errors.guests ? 'border-red-400' : ''}`}
                            />
                          </div>
                        </Field>
                      </div>
                    </fieldset>

                    {/* ── Date & time ────────────────────────────── */}
                    <fieldset className="mb-7">
                      <legend className="text-xs font-semibold uppercase tracking-widest
                                         text-gold mb-4">
                        Date &amp; Time
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                        <Field label="Preferred Date" error={errors.date} required>
                          <div className="relative">
                            <FiCalendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                              text-offwhite/30 pointer-events-none" />
                            <input id="field-date" name="date" type="date"
                              min={getMinDate()}
                              value={form.date} onChange={handleChange}
                              className={`input-base pl-10 ${errors.date ? 'border-red-400' : ''}
                                          [color-scheme:dark]`}
                            />
                          </div>
                        </Field>

                        <Field label="Preferred Time" error={errors.time} required>
                          <div className="relative">
                            <FiClock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                           text-offwhite/30 pointer-events-none" />
                            <select id="field-time" name="time"
                              value={form.time} onChange={handleChange}
                              className={`input-base pl-10 appearance-none bg-charcoal cursor-pointer
                                          ${errors.time ? 'border-red-400' : ''}`}
                            >
                              <option value="">Select a time</option>
                              {TIME_SLOTS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        </Field>
                      </div>

                      {/* Time slot grid (visual picker) */}
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setForm((p) => ({ ...p, time: slot }));
                              setErrors((p) => ({ ...p, time: undefined }));
                            }}
                            className={`text-xs py-2 px-1 rounded-sm border transition-all duration-150
                                        ${form.time === slot
                                          ? 'bg-gold text-charcoal border-gold font-semibold'
                                          : 'border-white/15 text-offwhite/50 hover:border-gold/40 hover:text-offwhite'
                                        }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* ── Occasion & requests ────────────────────── */}
                    <fieldset className="mb-8">
                      <legend className="text-xs font-semibold uppercase tracking-widest
                                         text-gold mb-4">
                        Special Details
                      </legend>
                      <div className="grid grid-cols-1 gap-4">

                        <Field label="Occasion">
                          <select name="occasion" value={form.occasion} onChange={handleChange}
                            className="input-base appearance-none bg-charcoal cursor-pointer">
                            {OCCASIONS.map(({ value, label }) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Special Requests">
                          <div className="relative">
                            <FiMessageSquare size={15}
                              className="absolute left-3.5 top-3.5 text-offwhite/30 pointer-events-none" />
                            <textarea name="specialRequests" rows={3}
                              value={form.specialRequests} onChange={handleChange}
                              placeholder="Dietary requirements, seating preferences, celebration setup…"
                              maxLength={400}
                              className="input-base pl-10 resize-none"
                            />
                          </div>
                          <p className="text-right text-xs text-offwhite/25 mt-1">
                            {form.specialRequests.length}/400
                          </p>
                        </Field>
                      </div>
                    </fieldset>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full sm:w-auto px-10 py-4 text-base gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal
                                          rounded-full animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <><FiCalendar size={17} /> Confirm Reservation</>
                      )}
                    </button>

                    {!isAuthenticated && (
                      <p className="mt-4 text-sm text-offwhite/40">
                        <Link to="/login" className="text-gold underline-gold hover:text-gold-light">
                          Sign in
                        </Link>{' '}
                        to manage your reservations online.
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Info sidebar ───────────────────────────── */}
            <aside aria-label="Reservation information">
              <div className="space-y-6 sticky top-28">

                {/* Image */}
                <div className="rounded-sm overflow-hidden h-48">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=75"
                    alt="Urban Cuisine dining room"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info box */}
                <div className="card rounded-sm p-5 space-y-4">
                  <h3 className="font-heading text-offwhite text-lg">Good to Know</h3>
                  {[
                    { icon: FiClock,    text: 'Reservations open daily from 12 PM' },
                    { icon: FiUsers,    text: 'Groups of 10+ please call us directly' },
                    { icon: FiCalendar, text: 'We hold your table for 15 minutes' },
                    { icon: FiPhone,    text: '+1 (212) 555-0123 for same-day bookings' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 text-sm text-offwhite/55">
                      <Icon size={15} className="text-gold mt-0.5 shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Hours */}
                <div className="card rounded-sm p-5">
                  <h3 className="font-heading text-offwhite text-lg mb-4">Opening Hours</h3>
                  {[
                    { day: 'Mon – Thu', time: '12pm – 10pm' },
                    { day: 'Fri – Sat', time: '12pm – 11:30pm' },
                    { day: 'Sunday',    time: '1pm – 9pm'    },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex justify-between text-sm py-1.5
                                              border-b border-white/8 last:border-0">
                      <span className="text-offwhite/60">{day}</span>
                      <span className="text-gold font-medium">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* ── My Reservations (logged-in only) ──────────────────── */}
          {isAuthenticated && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-offwhite">
                  My <span className="text-gold">Reservations</span>
                </h2>
                <button
                  onClick={fetchMyReservations}
                  className="text-sm text-offwhite/40 hover:text-gold transition-colors"
                >
                  Refresh
                </button>
              </div>

              {loadingMy ? (
                <LoadingSpinner size="sm" />
              ) : myReservations.length === 0 ? (
                <div className="text-center py-12 card rounded-sm">
                  <p className="text-offwhite/40 mb-1">No reservations yet</p>
                  <p className="text-sm text-offwhite/25">
                    Your upcoming bookings will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {myReservations.map((r) => (
                      <ReservationCard
                        key={r._id}
                        reservation={r}
                        onCancel={handleCancelReservation}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </PageLayout>
  );
}
