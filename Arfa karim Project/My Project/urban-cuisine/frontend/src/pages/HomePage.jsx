import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FiArrowRight,
  FiCalendar,
  FiStar,
  FiAward,
  FiClock,
  FiMapPin,
  FiChevronDown,
  FiMessageCircle,
} from "react-icons/fi";
import PageLayout from "../components/layout/PageLayout";
import SectionHeader from "../components/ui/SectionHeader";
import MenuItemCard from "../components/ui/MenuItemCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useFetch from "../hooks/useFetch";

// ── Unsplash image constants ───────────────────────────────────────────────────
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&auto=format&fit=crop&q=85",
  about:
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=900&auto=format&fit=crop&q=80",
  chef: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&auto=format&fit=crop&q=80",
  interior1:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&auto=format&fit=crop&q=75",
  interior2:
    "https://images.unsplash.com/photo-1552566626-52f8b828a5a0?w=700&auto=format&fit=crop&q=75",
  cta: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&auto=format&fit=crop&q=80",
};

const STATS = [
  { value: "15+", label: "Years of Excellence" },
  { value: "120+", label: "Signature Dishes" },
  { value: "50k+", label: "Happy Guests" },
  { value: "3", label: "Michelin Stars" },
];

const TESTIMONIALS = [
  {
    name: "Alexandra M.",
    role: "Food Critic, NY Times",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop",
    quote:
      "Urban Cuisine redefines what fine dining means in New York. Every dish is a masterpiece of flavour and presentation.",
    stars: 5,
  },
  {
    name: "James K.",
    role: "Regular Guest",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&auto=format&fit=crop",
    quote:
      "I've dined at restaurants around the world — Urban Cuisine holds its own against the very best. The lamb is extraordinary.",
    stars: 5,
  },
  {
    name: "Priya S.",
    role: "Travel Blogger",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&auto=format&fit=crop",
    quote:
      "The ambiance, the service, the tasting menu — an unforgettable evening. Urban Cuisine is my go-to recommendation for New York.",
    stars: 5,
  },
];

// ── Framer Motion variants ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ value, label, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="text-center px-6 py-8 border border-white/10 rounded-sm
                 hover:border-gold/40 transition-colors duration-300"
    >
      <p className="font-heading text-4xl lg:text-5xl text-gold font-bold mb-2">
        {value}
      </p>
      <p className="text-offwhite/55 text-sm uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );
}

function StarRating({ count }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <FiStar key={i} size={13} className="text-gold fill-gold" />
      ))}
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────────
export default function HomePage() {
  const { data, loading } = useFetch("/menu", { params: { featured: "true" } });
  const featuredItems = data?.data?.slice(0, 3) ?? [];
  const heroRef = useRef(null);

  const scrollDown = () => {
    const el = document.getElementById("about-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageLayout>
      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={IMAGES.hero}
            alt="Urban Cuisine dining room"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 overlay-dark" />
        </div>

        {/* Gold accent line — left edge */}
        <div
          className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b
                        from-transparent via-gold/50 to-transparent hidden lg:block"
        />

        {/* Hero content */}
        <div className="relative z-10 container-main px-4 sm:px-6 text-center max-w-4xl">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-6"
          >
            Fine Dining · New York City
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-offwhite
                       leading-[1.05] mb-6 text-shadow-gold"
          >
            Where Every Meal
            <br />
            <em className="text-gold not-italic">Tells a Story</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-offwhite/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Savour bold, seasonal flavours crafted by award-winning chefs in an
            atmosphere as unforgettable as the food itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto"
          >
            <Link
              to="/reservations"
              className="btn-primary gap-2 text-base px-8 py-4"
            >
              <FiCalendar size={18} /> Reserve a Table
            </Link>
            <Link to="/menu" className="btn-outline gap-2 text-base px-8 py-4">
              View Our Menu <FiArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/923079009095?text=Hi%20Urban%20Cuisine%2C%20I%27d%20like%20to%20make%20a%20reservation..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-base px-8 py-4 rounded-sm
                         font-semibold border border-green-500/60 text-green-400
                         w-full sm:w-auto
                         hover:bg-green-500 hover:text-white hover:border-green-500
                         transition-all duration-300 active:scale-[0.98]"
              aria-label="Contact us on WhatsApp"
            >
              <FiMessageCircle size={18} /> WhatsApp Us
            </a>
          </motion.div>

          {/* Info pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-14
                       text-offwhite/50 text-sm"
          >
            <span className="flex items-center gap-1.5">
              <FiClock size={14} className="text-gold" /> Open Daily 12pm – 11pm
            </span>
            <span className="w-px h-4 bg-white/20 hidden sm:block" />
            <span className="flex items-center gap-1.5">
              <FiMapPin size={14} className="text-gold" /> Armour Colony,
              Nowshera
            </span>
            <span className="w-px h-4 bg-white/20 hidden sm:block" />
            <span className="flex items-center gap-1.5">
              <FiAward size={14} className="text-gold" /> Fine Dining Experience
            </span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollDown}
          aria-label="Scroll to content"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
                     gap-1 text-offwhite/40 hover:text-gold transition-colors duration-200 group"
        >
          <span className="text-xs uppercase tracking-widest">Discover</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <FiChevronDown size={20} />
          </motion.div>
        </button>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="bg-black/50 border-y border-white/10"
        aria-label="Statistics"
      >
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <StatCard
                key={s.label}
                value={s.value}
                label={s.label}
                index={i}
              />
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT TEASER
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="about-section"
        className="section-pad"
        aria-label="About Urban Cuisine"
      >
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Images mosaic */}
            <AnimatedSection className="relative flex flex-col items-center lg:block">
              <motion.div
                variants={fadeUp}
                custom={0}
                className="relative z-10 rounded-sm overflow-hidden shadow-2xl shadow-black/50 w-full"
              >
                <img
                  src={IMAGES.about}
                  alt="Urban Cuisine interior"
                  className="w-full h-80 lg:h-[480px] object-cover"
                  loading="lazy"
                />
              </motion.div>
              {/* Floating accent image */}
              <motion.div
                variants={fadeUp}
                custom={1}
                className="relative mt-4 ml-auto w-40 h-40 sm:w-44 sm:h-44 lg:absolute lg:-bottom-8 lg:-right-8 lg:w-56 lg:h-56 lg:mt-0 lg:ml-0
                           rounded-sm overflow-hidden border-4 border-charcoal shadow-xl z-20"
              >
                <img
                  src={IMAGES.chef}
                  alt="Executive chef at work"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              {/* Gold decorative square */}
              <div
                className="absolute -top-4 -left-4 w-24 h-24 border-2 border-gold/30
                              rounded-sm -z-10"
              />
            </AnimatedSection>

            {/* Text */}
            <AnimatedSection>
              <motion.span
                variants={fadeUp}
                custom={0}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-gold block mb-4"
              >
                Our Story
              </motion.span>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="section-title mb-6"
              >
                Crafted with Passion,
                <br />
                <span className="text-gold italic">Served with Pride</span>
              </motion.h2>
              <div className="h-0.5 w-14 bg-gold mb-8" />
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-offwhite/60 text-base leading-relaxed mb-5"
              >
                Born in 2009 from a single vision — to bring honest,
                ingredient-led cooking to the heart of New York City — Urban
                Cuisine has grown into one of the most celebrated dining
                destinations in the Northeast.
              </motion.p>
              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-offwhite/60 text-base leading-relaxed mb-8"
              >
                Executive Chef Marco Valdez and his team source the finest
                seasonal produce, weaving global influences into menus that
                change with the rhythms of nature and the city they call home.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex flex-wrap gap-4"
              >
                <Link to="/about" className="btn-primary gap-2">
                  Our Story <FiArrowRight size={16} />
                </Link>
                <Link to="/menu" className="btn-outline gap-2">
                  See the Menu
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED MENU
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-pad bg-black/30" aria-label="Featured dishes">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="From the Kitchen"
            title={
              <>
                Chef's <span className="text-gold italic">Signature</span>{" "}
                Selection
              </>
            }
            subtitle="Hand-picked by Executive Chef Marco Valdez — dishes that define the Urban Cuisine experience."
          />

          {loading ? (
            <LoadingSpinner />
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {featuredItems.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            /* Fallback placeholder cards when API is not yet seeded */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {PLACEHOLDER_DISHES.map((dish) => (
                <MenuItemCard key={dish._id} item={dish} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/menu" className="btn-outline gap-2 text-sm px-8 py-3">
              Explore Full Menu <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          GALLERY / ATMOSPHERE STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="py-0 overflow-hidden"
        aria-label="Restaurant atmosphere"
      >
        <div className="flex flex-col sm:flex-row h-auto sm:h-72 lg:h-80">
          {[
            { src: IMAGES.interior1, alt: "Elegant dining room" },
            { src: IMAGES.cta, alt: "Table setting" },
            { src: IMAGES.interior2, alt: "Bar and lounge" },
          ].map(({ src, alt }, i) => (
            <motion.div
              key={i}
              className="flex-1 overflow-hidden relative group h-56 sm:h-auto"
              whileHover={{ flex: 1.8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-700
                           group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/10
                              transition-colors duration-500"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-pad" aria-label="Guest testimonials">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Guest Reviews"
            title={
              <>
                What Our <span className="text-gold italic">Guests</span> Say
              </>
            }
          />

          <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.article
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="card rounded-sm p-6 flex flex-col gap-4"
              >
                <StarRating count={t.stars} />
                <blockquote className="text-offwhite/70 text-sm leading-relaxed italic flex-1">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/30"
                  />
                  <div>
                    <p className="text-offwhite text-sm font-semibold">
                      {t.name}
                    </p>
                    <p className="text-offwhite/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          RESERVATION CTA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        aria-label="Reserve a table"
      >
        <div className="absolute inset-0">
          <img
            src={IMAGES.cta}
            alt="Fine dining table setting"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0 overlay-dark"
            style={{ background: "rgba(26,26,26,0.82)" }}
          />
        </div>

        <div className="relative z-10 section-pad text-center">
          <div className="container-main px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-gold block mb-4"
            >
              Reservations
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-title mb-5"
            >
              Make it a Night
              <br />
              <span className="text-gold italic">to Remember</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-offwhite/60 mb-8 leading-relaxed"
            >
              Whether it's a birthday, anniversary, or a spontaneous Tuesday —
              we'll make every occasion feel extraordinary. Book your table
              online in under a minute.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/reservations"
                className="btn-primary gap-2 text-base px-9 py-4"
              >
                <FiCalendar size={18} /> Book a Table
              </Link>
              <a
                href="tel:+12125550123"
                className="btn-outline gap-2 text-base px-9 py-4"
              >
                Call Us Now
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// ── Placeholder dishes (shown before DB is seeded) ────────────────────────────
const PLACEHOLDER_DISHES = [
  {
    _id: "p1",
    name: "Pan-Seared Salmon",
    description:
      "Atlantic salmon fillet, lemon beurre blanc, capers, wilted baby spinach and crispy capers.",
    price: 38,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop",
    isFeatured: true,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    _id: "p2",
    name: "Truffle Risotto",
    description:
      "Carnaroli rice, black truffle, aged Parmigiano-Reggiano, fresh thyme, and olive oil.",
    price: 34,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop",
    isFeatured: true,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    _id: "p3",
    name: "Chocolate Fondant",
    description:
      "Warm dark chocolate pudding with a molten centre, served with vanilla bean ice cream.",
    price: 18,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop",
    isFeatured: true,
    isVegetarian: true,
    isSpicy: false,
  },
];
