import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiPhone, FiMessageSquare,
  FiSend, FiCheckCircle, FiAlertCircle,
  FiMapPin, FiClock, FiInstagram, FiFacebook, FiTwitter,
  FiMessageCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import api from '../services/api';

// ── Real contact details ───────────────────────────────────────────────────────
const SUBJECTS = [
  'General Enquiry',
  'Reservation / Booking',
  'Private Dining & Events',
  'Press & Media',
  'Careers',
  'Feedback',
  'Other',
];

const CONTACT_INFO = [
  {
    icon: FiMapPin,
    title: 'Visit Us',
    lines: ['Armour Colony, Nowshera', 'Khyber Pakhtunkhwa, Pakistan'],
  },
  {
    icon: FiPhone,
    title: 'Call Us',
    lines: ['0320-9880120', 'Mon–Sat · 10am – 10pm'],
    href: 'tel:+923209880120',
  },
  {
    icon: FiMessageCircle,
    title: 'WhatsApp',
    lines: ['0307-9009095', 'Quick replies on WhatsApp'],
    href: 'https://wa.me/923079009095',
  },
  {
    icon: FiMail,
    title: 'Email Us',
    lines: ['maliknabeelkhattak432@gmail.com', 'We reply within 24 hours'],
    href: 'mailto:maliknabeelkhattak432@gmail.com',
  },
  {
    icon: FiClock,
    title: 'Opening Hours',
    lines: ['Mon–Thu: 12pm – 10pm', 'Fri–Sat: 12pm – 11:30pm', 'Sunday: 1pm – 9pm'],
  },
];

const SOCIAL = [
  { icon: FiInstagram,     href: 'https://instagram.com/urbancuisine',  label: 'Instagram', handle: '@urbancuisine'      },
  { icon: FiFacebook,      href: 'https://facebook.com/urbancuisine',   label: 'Facebook',  handle: 'Urban Cuisine'      },
  { icon: FiTwitter,       href: 'https://twitter.com/urbancuisine',    label: 'Twitter',   handle: '@urbancuisine'      },
  { icon: FiMessageCircle, href: 'https://wa.me/923079009095',          label: 'WhatsApp',  handle: '0307-9009095'       },
];

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' };

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, error, required, children }) {
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm]             = useState(EMPTY_FORM);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Your name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Please select a subject';
    if (!form.message.trim()) e.message = 'Message cannot be empty';
    else if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      toast.success("Message sent! We'll be in touch soon.");
    } catch (err) {
      toast.error(err.message || 'Could not send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-64 sm:h-72 flex items-end overflow-hidden" aria-label="Contact hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1400&auto=format&fit=crop&q=80"
            alt="Restaurant entrance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 overlay-dark" />
        </div>
        <div className="relative z-10 container-main px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Get in Touch
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl text-offwhite">
            Contact <span className="text-gold italic">Us</span>
          </motion.h1>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="section-pad">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── LEFT: Form ────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }} className="card rounded-sm p-10 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
                      className="w-20 h-20 bg-gold/15 border border-gold/30 rounded-full
                                 flex items-center justify-center mx-auto mb-6">
                      <FiCheckCircle size={36} className="text-gold" />
                    </motion.div>
                    <h2 className="font-heading text-2xl text-offwhite mb-3">Message Received!</h2>
                    <p className="text-offwhite/60 max-w-md mx-auto mb-8">
                      Thank you, <span className="text-offwhite font-medium">{form.name}</span>.
                      We will respond to <span className="text-gold">{form.email}</span> within 24 hours.
                      You can also reach us on WhatsApp at{' '}
                      <a href="https://wa.me/923079009095" className="text-gold underline">0307-9009095</a>.
                    </p>
                    <button onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }}
                      className="btn-outline gap-2">
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit} noValidate aria-label="Contact form">
                    <h2 className="font-heading text-2xl text-offwhite mb-6">Send Us a Message</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <Field label="Your Name" error={errors.name} required>
                        <div className="relative">
                          <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-offwhite/30 pointer-events-none" />
                          <input name="name" type="text" value={form.name} onChange={handleChange}
                            placeholder="Your full name" autoComplete="name"
                            className={`input-base pl-10 ${errors.name ? 'border-red-400' : ''}`} />
                        </div>
                      </Field>

                      <Field label="Email Address" error={errors.email} required>
                        <div className="relative">
                          <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-offwhite/30 pointer-events-none" />
                          <input name="email" type="email" value={form.email} onChange={handleChange}
                            placeholder="you@example.com" autoComplete="email"
                            className={`input-base pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                        </div>
                      </Field>

                      <Field label="Phone (optional)">
                        <div className="relative">
                          <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-offwhite/30 pointer-events-none" />
                          <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                            placeholder="03xx-xxxxxxx" autoComplete="tel"
                            className="input-base pl-10" />
                        </div>
                      </Field>

                      <Field label="Subject" error={errors.subject} required>
                        <select name="subject" value={form.subject} onChange={handleChange}
                          className={`input-base appearance-none bg-charcoal cursor-pointer ${errors.subject ? 'border-red-400' : ''}`}>
                          <option value="">Select a subject</option>
                          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                    </div>

                    <div className="mb-6">
                      <Field label="Message" error={errors.message} required>
                        <div className="relative">
                          <FiMessageSquare size={15} className="absolute left-3.5 top-3.5 text-offwhite/30 pointer-events-none" />
                          <textarea name="message" rows={6} value={form.message} onChange={handleChange}
                            placeholder="Tell us how we can help…" maxLength={1000}
                            className={`input-base pl-10 resize-none ${errors.message ? 'border-red-400' : ''}`} />
                        </div>
                        <p className="text-right text-xs text-offwhite/25 mt-1">{form.message.length}/1000</p>
                      </Field>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      <button type="submit" disabled={submitting} className="btn-primary gap-2 px-8 py-4">
                        {submitting ? (
                          <><div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />Sending…</>
                        ) : (
                          <><FiSend size={16} /> Send Message</>
                        )}
                      </button>
                      {/* Quick WhatsApp CTA */}
                      <a href="https://wa.me/923079009095?text=Hi%20Urban%20Cuisine%2C%20I%27d%20like%20to%20enquire%20about..."
                        target="_blank" rel="noopener noreferrer"
                        className="btn-outline gap-2 px-6 py-4 border-green-500/50 text-green-400
                                   hover:bg-green-500 hover:text-white hover:border-green-500">
                        <FiMessageCircle size={16} /> WhatsApp Us
                      </a>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Contact info sidebar ───────────────────── */}
            <aside aria-label="Contact information" className="space-y-4">
              <div className="sticky top-28 space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, title, lines, href }) => (
                  <div key={title} className="card rounded-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-gold/10 border border-gold/25 rounded-sm
                                      flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-gold" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-offwhite text-sm mb-0.5">{title}</h3>
                        {lines.map((line, i) =>
                          href && i === 0 ? (
                            <a key={line} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                              rel="noopener noreferrer"
                              className="block text-sm text-offwhite/55 hover:text-gold transition-colors truncate">
                              {line}
                            </a>
                          ) : (
                            <p key={line} className="text-xs text-offwhite/40">{line}</p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Social */}
                <div className="card rounded-sm p-4">
                  <h3 className="font-heading text-offwhite text-sm mb-3">Follow Us</h3>
                  <div className="space-y-2">
                    {SOCIAL.map(({ icon: Icon, href, label, handle }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                        aria-label={label}
                        className="flex items-center gap-2.5 text-offwhite/55 hover:text-gold
                                   transition-colors duration-200 group">
                        <div className="w-7 h-7 border border-white/15 rounded-sm flex items-center
                                        justify-center group-hover:border-gold transition-colors shrink-0">
                          <Icon size={13} />
                        </div>
                        <span className="text-sm">{handle}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* ── Google Maps embed ────────────────────────────────── */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-offwhite">
                Find <span className="text-gold italic">Us</span>
              </h2>
              <a
                href="https://maps.google.com/?q=Armour+Colony+Nowshera+Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:text-gold-light underline-gold transition-colors flex items-center gap-1"
              >
                <FiMapPin size={12} /> Open in Google Maps →
              </a>
            </div>

            {/* Address bar above map */}
            <div className="flex items-center gap-3 mb-4 px-4 py-3
                            bg-gold/5 border border-gold/20 rounded-sm">
              <FiMapPin size={16} className="text-gold shrink-0" />
              <div>
                <p className="text-offwhite text-sm font-medium">Urban Cuisine</p>
                <p className="text-offwhite/50 text-xs">Armour Colony, Nowshera, Khyber Pakhtunkhwa, Pakistan</p>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-sm overflow-hidden border border-white/10 shadow-xl shadow-black/40"
                 style={{ height: '450px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5040.627382396301!2d71.97800778874286!3d33.97404564010498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ded36c42a9fe5f%3A0xebffbb0ce10e40f!2sArmour%20Colony%2C%20Nowshera%2C%20Pakistan!5e1!3m2!1sen!2s!4v1784201149956!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Urban Cuisine location — Armour Colony, Nowshera"
              />
            </div>
            <p className="text-offwhite/25 text-xs mt-2 text-center">
              Armour Colony, Nowshera, Khyber Pakhtunkhwa, Pakistan
            </p>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
