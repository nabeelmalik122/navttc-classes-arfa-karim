import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiAward, FiHeart, FiStar } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import SectionHeader from '../components/ui/SectionHeader';

// ── Images ─────────────────────────────────────────────────────────────────────
const IMAGES = {
  hero:     'https://images.unsplash.com/photo-1552566626-52f8b828a5a0?w=1600&auto=format&fit=crop&q=80',
  story1:   'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80',
  story2:   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80',
  kitchen:  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&auto=format&fit=crop&q=80',
  interior: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
};

// ── Team data ──────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Marco Valdez',
    role: 'Executive Chef & Founder',
    bio: 'Trained in Lyon and Tokyo, Marco brings 20 years of Michelin-starred experience to every plate he crafts.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&auto=format&fit=crop',
    awards: ['3 Michelin Stars', 'James Beard Award 2019'],
  },
  {
    name: 'Isabelle Chen',
    role: 'Head Pastry Chef',
    bio: 'A graduate of Le Cordon Bleu Paris, Isabelle\'s desserts blur the line between cuisine and fine art.',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=400&auto=format&fit=crop',
    awards: ['Best Pastry Chef NYC 2022'],
  },
  {
    name: 'Damian Osei',
    role: 'Sommelier',
    bio: 'With a cellar of 800+ labels, Damian pairs each dish with a wine that elevates the entire experience.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop',
    awards: ['Master Sommelier 2017'],
  },
  {
    name: 'Sofia Reyes',
    role: 'Front of House Director',
    bio: 'Sofia orchestrates every guest experience with warmth and precision — the face behind Urban Cuisine\'s legendary hospitality.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop',
    awards: ['Service Excellence Award 2023'],
  },
];

// ── Values ─────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: FiAward,
    title: 'Uncompromising Quality',
    desc: 'Every ingredient is sourced with intention — seasonal, local where possible, and held to the highest standard before it reaches your plate.',
  },
  {
    icon: FiHeart,
    title: 'Genuine Hospitality',
    desc: "We believe dining is one of life's great pleasures. Our team is here to make every visit feel personal, unhurried, and memorable.",
  },
  {
    icon: FiStar,
    title: 'Creative Craft',
    desc: 'Our menu evolves with the seasons and with inspiration. We never stop exploring new techniques, flavours, and stories to tell through food.',
  },
];

// ── Milestones ──────────────────────────────────────────────────────────────────
const MILESTONES = [
  { year: '2009', event: 'Urban Cuisine opens its doors in Downtown Manhattan with 40 covers.' },
  { year: '2012', event: 'First Michelin Star awarded. Chef Marco named Best Newcomer by NY Times.' },
  { year: '2015', event: 'Expansion to 120 covers. Private dining room opens for events.' },
  { year: '2018', event: 'Third Michelin Star. Ranked #4 in the World\'s 50 Best Restaurants.' },
  { year: '2022', event: 'Launch of the seasonal tasting menu and chef\'s table experience.' },
  { year: '2024', event: 'Named "Restaurant of the Decade" by Food & Wine Magazine.' },
];

// ── Animation helper ────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <PageLayout>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-72 sm:h-96 flex items-end overflow-hidden" aria-label="About hero">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Urban Cuisine dining atmosphere"
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 overlay-dark" />
        </div>
        <div className="relative z-10 container-main px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="font-heading text-4xl sm:text-6xl text-offwhite leading-tight">
            About <span className="text-gold italic">Urban Cuisine</span>
          </motion.h1>
        </div>
      </section>

      {/* ── Origin story ──────────────────────────────────────────── */}
      <section className="section-pad" aria-label="Our origin story">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold block mb-4">
                Since 2009
              </span>
              <h2 className="section-title mb-5">
                Born from a Single <span className="text-gold italic">Obsession</span>
              </h2>
              <div className="h-0.5 w-14 bg-gold mb-7" />
              <p className="text-offwhite/60 leading-relaxed mb-5">
                Urban Cuisine was born from a simple, stubborn belief: that New York deserved a restaurant where every detail — the sourcing, the cooking, the service, the space — was held to the same exacting standard.
              </p>
              <p className="text-offwhite/60 leading-relaxed mb-5">
                Chef Marco Valdez opened the original 40-seat dining room in 2009 after years training in Lyon's finest kitchens and a transformative year in Tokyo studying kaiseki philosophy. He brought both cultures' obsession with precision and seasonal purity to Manhattan.
              </p>
              <p className="text-offwhite/60 leading-relaxed mb-8">
                Fifteen years later, Urban Cuisine is one of the most decorated restaurants in the United States. But our kitchen team still tastes every sauce, sources every leaf, and debates every plate before it leaves the pass.
              </p>
              <Link to="/reservations" className="btn-primary gap-2">
                Reserve a Table <FiArrowRight size={16} />
              </Link>
            </Reveal>

            {/* Image collage */}
            <Reveal delay={1} className="relative h-[480px]">
              <div className="absolute inset-0 rounded-sm overflow-hidden shadow-2xl shadow-black/50">
                <img src={IMAGES.story2} alt="Elegant plating" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-52 h-52 rounded-sm overflow-hidden
                              border-4 border-charcoal shadow-xl z-10">
                <img src={IMAGES.story1} alt="Chef at work" className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* Decorative gold frame */}
              <div className="absolute -top-4 -right-4 w-28 h-28 border-2 border-gold/25 rounded-sm pointer-events-none" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section className="section-pad bg-black/30" aria-label="Our values">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What We Stand For"
            title={<>Our <span className="text-gold italic">Core Values</span></>}
            subtitle="Three principles shape every decision we make — from how we source our produce to how we greet you at the door."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i}>
                <div className="card rounded-sm p-8 h-full flex flex-col gap-5 group hover:border-gold/30
                                transition-colors duration-300">
                  <div className="w-12 h-12 bg-gold/10 border border-gold/25 rounded-sm
                                  flex items-center justify-center group-hover:bg-gold/20
                                  transition-colors duration-300">
                    <Icon size={22} className="text-gold" />
                  </div>
                  <h3 className="font-heading text-xl text-offwhite">{title}</h3>
                  <p className="text-offwhite/55 text-sm leading-relaxed flex-1">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kitchen & interior split ───────────────────────────────── */}
      <section className="py-0 overflow-hidden h-72 sm:h-96 flex" aria-label="Kitchen and interior">
        {[
          { src: IMAGES.kitchen,  alt: 'Kitchen in action',       caption: 'The Kitchen' },
          { src: IMAGES.interior, alt: 'Dining room atmosphere',  caption: 'The Dining Room' },
        ].map(({ src, alt, caption }, i) => (
          <motion.div
            key={i}
            className="flex-1 relative overflow-hidden group cursor-default"
            whileHover={{ flex: 1.5 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={src} alt={alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-charcoal/50 group-hover:bg-charcoal/20 transition-colors duration-500" />
            <span className="absolute bottom-5 left-5 font-heading text-offwhite text-xl
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {caption}
            </span>
          </motion.div>
        ))}
      </section>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <section className="section-pad" aria-label="Our milestones">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Journey"
            title={<>Fifteen Years of <span className="text-gold italic">Excellence</span></>}
          />
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

            <div className="space-y-8">
              {MILESTONES.map(({ year, event }, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <Reveal key={year} delay={i * 0.5}>
                    <div className={`relative flex items-start gap-6 pl-12 sm:pl-0
                                    ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                      {/* Dot */}
                      <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3
                                      bg-gold rounded-full border-2 border-charcoal ring-4 ring-gold/20
                                      shrink-0 mt-1.5" />

                      {/* Year */}
                      <div className={`hidden sm:flex items-center justify-center w-[calc(50%-28px)]
                                       ${isLeft ? 'pr-8 justify-end' : 'pl-8 justify-start'}`}>
                        <span className="font-heading text-gold text-2xl font-bold">{year}</span>
                      </div>

                      {/* Card */}
                      <div className={`card rounded-sm p-5 sm:w-[calc(50%-28px)]
                                       ${isLeft ? 'sm:pl-8' : 'sm:pr-8'}`}>
                        <span className="sm:hidden text-gold font-bold text-sm mb-1 block">{year}</span>
                        <p className="text-offwhite/65 text-sm leading-relaxed">{event}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────── */}
      <section className="section-pad bg-black/30" aria-label="Our team">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="The People"
            title={<>Meet the <span className="text-gold italic">Team</span></>}
            subtitle="The talent and passion behind every plate, every pour, and every smile."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, bio, image, awards }, i) => (
              <Reveal key={name} delay={i}>
                <article className="card rounded-sm overflow-hidden group">
                  <div className="h-64 overflow-hidden relative">
                    <img src={image} alt={name}
                      className="w-full h-full object-cover transition-transform duration-500
                                 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-offwhite text-lg leading-snug">{name}</h3>
                    <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">{role}</p>
                    <p className="text-offwhite/50 text-sm leading-relaxed mb-4">{bio}</p>
                    <div className="space-y-1">
                      {awards.map((a) => (
                        <p key={a} className="text-offwhite/35 text-xs flex items-center gap-1.5">
                          <FiAward size={11} className="text-gold shrink-0" />{a}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section-pad text-center" aria-label="Call to action">
        <div className="container-main px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              Come Dine With Us
            </p>
            <h2 className="section-title mb-5">
              Your Table is <span className="text-gold italic">Waiting</span>
            </h2>
            <div className="h-0.5 w-14 bg-gold mx-auto mb-6" />
            <p className="text-offwhite/55 mb-8 leading-relaxed">
              Every great story deserves a great meal. We look forward to welcoming you to Urban Cuisine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reservations" className="btn-primary gap-2 px-8">
                Book a Table <FiArrowRight size={16} />
              </Link>
              <Link to="/menu" className="btn-outline gap-2 px-8">
                Explore Menu
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </PageLayout>
  );
}
