import { Link } from 'react-router-dom';
import {
  FiInstagram, FiFacebook, FiTwitter,
  FiMapPin, FiPhone, FiMail, FiClock, FiMessageCircle,
} from 'react-icons/fi';

const LINKS = {
  explore: [
    { to: '/',            label: 'Home'         },
    { to: '/menu',        label: 'Our Menu'     },
    { to: '/reservations',label: 'Reservations' },
    { to: '/about',       label: 'About Us'     },
    { to: '/contact',     label: 'Contact'      },
  ],
  account: [
    { to: '/login',    label: 'Sign In'          },
    { to: '/register', label: 'Create Account'   },
  ],
};

const SOCIAL = [
  { icon: FiInstagram,    href: 'https://instagram.com/urbancuisine',  label: 'Instagram' },
  { icon: FiFacebook,     href: 'https://facebook.com/urbancuisine',   label: 'Facebook'  },
  { icon: FiTwitter,      href: 'https://twitter.com/urbancuisine',    label: 'Twitter'   },
  { icon: FiMessageCircle,href: 'https://wa.me/923079009095',          label: 'WhatsApp'  },
];

const HOURS = [
  { day: 'Mon – Thu', time: '12:00 pm – 10:00 pm' },
  { day: 'Fri – Sat', time: '12:00 pm – 11:30 pm' },
  { day: 'Sunday',    time: '1:00 pm – 9:00 pm'   },
];

export default function Footer() {
  return (
    <footer className="bg-black/60 border-t border-white/10 mt-auto" aria-label="Site footer">
      <div className="container-main section-pad pb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Brand ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="Urban Cuisine home">
              <div className="w-9 h-9 bg-gold rounded-sm flex items-center justify-center">
                <span className="font-heading font-bold text-charcoal text-lg leading-none">U</span>
              </div>
              <span className="font-heading text-xl text-offwhite">
                Urban<span className="text-gold">Cuisine</span>
              </span>
            </Link>
            <p className="text-offwhite/50 text-sm leading-relaxed mb-5">
              A celebration of bold flavours, timeless craft, and the art of fine dining — right in the heart of the city.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/15 rounded-sm flex items-center justify-center
                             text-offwhite/50 hover:border-gold hover:text-gold transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Explore links ─────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-5">Explore</h3>
            <ul className="space-y-2.5">
              {LINKS.explore.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-offwhite/55 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Hours ─────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-5">
              Opening Hours
            </h3>
            <ul className="space-y-2.5">
              {HOURS.map(({ day, time }) => (
                <li key={day} className="flex items-start gap-2">
                  <FiClock size={14} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <span className="text-offwhite/80 text-sm block">{day}</span>
                    <span className="text-offwhite/45 text-xs">{time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact info ──────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-5">
              Find Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <FiMapPin size={15} className="text-gold mt-0.5 shrink-0" />
                <span className="text-offwhite/55 text-sm">
                  Armour Colony, Nowshera<br />Khyber Pakhtunkhwa, Pakistan
                </span>
              </li>
              <li>
                <a
                  href="tel:+923209880120"
                  className="flex items-center gap-2.5 text-offwhite/55 hover:text-gold text-sm transition-colors"
                >
                  <FiPhone size={15} className="text-gold shrink-0" />
                  0320-9880120
                </a>
              </li>
              <li>
                <a
                  href="tel:+923079009095"
                  className="flex items-center gap-2.5 text-offwhite/55 hover:text-gold text-sm transition-colors"
                >
                  <FiMessageCircle size={15} className="text-gold shrink-0" />
                  0307-9009095 (WhatsApp)
                </a>
              </li>
              <li>
                <a
                  href="mailto:maliknabeelkhattak432@gmail.com"
                  className="flex items-center gap-2.5 text-offwhite/55 hover:text-gold text-sm transition-colors"
                >
                  <FiMail size={15} className="text-gold shrink-0" />
                  maliknabeelkhattak432@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3 text-offwhite/30 text-xs">
          <p>© {new Date().getFullYear()} Urban Cuisine. All rights reserved.</p>
          <p>Crafted with care — Nowshera, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
