import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Activity,
  Check,
  Star,
  Calendar,
  Clock,
  Dumbbell,
  Gauge,
  Sparkles,
  MapPin,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { useGymStore } from "@/store/useGymStore";
import { isFirebaseConfigured } from "@/services/firebase/firebase.config";
import {
  MOCK_CLASSES,
  MOCK_TRAINERS,
  MOCK_PLANS,
  MOCK_REVIEWS
} from "@/services/mockData";
import {
  RotatingText,
  CountUp,
  MagicBento,
  type BentoItem,
  CursorGrid,
  VariableProximity,
  TextPressure,
} from "@/components/reactbits";

export default function HomePage() {
  const storeClasses = useGymStore((s) => s.classes);
  const storeTrainers = useGymStore((s) => s.trainers);
  const storePlans = useGymStore((s) => s.plans);
  const storeReviews = useGymStore((s) => s.reviews);

  // Filter out any placeholder text leaks and guarantee rich default datasets
  const cleanClasses = (storeClasses || []).filter(
    (c) =>
      c &&
      c.title &&
      !c.title.toUpperCase().includes("SCHEDULE ENTRY BASED") &&
      !c.title.toUpperCase().includes("DETAILS YOU PROVIDED")
  );

  const isProduction = isFirebaseConfigured && import.meta.env.VITE_ENABLE_DEMO_AUTH !== "true";
  const classes = isProduction ? cleanClasses : (cleanClasses.length >= 3 ? cleanClasses : MOCK_CLASSES);
  const trainers = (storeTrainers && storeTrainers.length >= 3) ? storeTrainers : MOCK_TRAINERS;
  const plans = (storePlans && storePlans.length >= 3) ? storePlans : MOCK_PLANS;
  const reviews = (storeReviews && storeReviews.length >= 3) ? storeReviews : MOCK_REVIEWS;

  const featuredClasses = classes.slice(0, 3);
  const featuredTrainers = trainers.slice(0, 3);
  const featuredReviews = reviews.slice(0, 3);

  const methodologyBentoItems: BentoItem[] = [
    {
      id: "bento-pillar-1",
      className: "lg:col-span-2 lg:row-span-2",
      children: (
        <div className="h-full p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#121217] border border-[#1f1f26] text-[11px] font-mono uppercase tracking-wider text-[#dfff00]">
              <Gauge className="w-3.5 h-3.5" aria-hidden="true" />
              FOUNDATIONAL PROTOCOL
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading leading-tight">
              PERIODIZED OVERLOAD & BIOMECHANICAL CONTROL
            </h3>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Random workouts generate random fatigue. IRONX employs structured resistance progression, strict tempo discipline, and kinematic load balancing to construct resilient, injury-proof power.
            </p>
            <ul className="space-y-3 pt-2 text-sm text-[#f4f4f5]">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#dfff00] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Individualized bar-path & joint-angle optimization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#dfff00] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Vibration-dampened subflooring for Olympic drop safety</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#dfff00] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Direct telemetry export into athlete portal</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 border-t border-[#1f1f26] flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#71717a] tracking-wider">
              Tier 1 Standards
            </span>
            <Link
              to="/classes"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#dfff00] hover:text-[#ebff33] transition-colors uppercase tracking-wider"
            >
              View Protocols <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: "bento-pillar-2",
      children: (
        <div className="h-full p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] shrink-0 shadow-[0_0_15px_rgba(223,255,0,0.15)]">
              <Dumbbell className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#dfff00] uppercase tracking-wider">Facility Architecture</div>
              <h4 className="text-lg font-bold text-white uppercase font-heading mt-0.5">
                Olympic & Power Vaults
              </h4>
              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1.5 leading-relaxed">
                Eleiko competition calibrated discs, custom IPF-spec combo racks, and deadlift platforms.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[#1f1f26] flex items-center justify-between text-xs font-mono">
            <span className="text-[#71717a] uppercase">Tolerance</span>
            <span className="text-[#dfff00] font-bold uppercase">± 0.01% Calibrated</span>
          </div>
        </div>
      ),
    },
    {
      id: "bento-pillar-3",
      children: (
        <div className="h-full p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] shrink-0 shadow-[0_0_15px_rgba(223,255,0,0.15)]">
              <Activity className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#dfff00] uppercase tracking-wider">Data & Progression</div>
              <h4 className="text-lg font-bold text-white uppercase font-heading mt-0.5">
                Kinematic Telemetry
              </h4>
              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1.5 leading-relaxed">
                InBody 770 composition scans and bar velocity sensors synced directly with your portal.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[#1f1f26] flex items-center justify-between text-xs font-mono">
            <span className="text-[#71717a] uppercase">Diagnostics</span>
            <span className="text-[#dfff00] font-bold uppercase">InBody 770 Sync</span>
          </div>
        </div>
      ),
    },
    {
      id: "bento-pillar-4",
      children: (
        <div className="h-full p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] shrink-0 shadow-[0_0_15px_rgba(223,255,0,0.15)]">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#dfff00] uppercase tracking-wider">Restoration Science</div>
              <h4 className="text-lg font-bold text-white uppercase font-heading mt-0.5">
                Contrast Cryo Suites
              </h4>
              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1.5 leading-relaxed">
                3°C cold plunge tanks, Finnish dry saunas, infrared photobiomodulation, and hyperbarics.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[#1f1f26] flex items-center justify-between text-xs font-mono">
            <span className="text-[#71717a] uppercase">Thermal Range</span>
            <span className="text-[#dfff00] font-bold uppercase">3°C Plunge • 90°C Sauna</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-28 pb-20 sm:pb-24 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section
        aria-label="IRONX Introduction"
        className="relative min-h-[82vh] lg:min-h-[85vh] flex items-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          {/* Left Column: Typography, Value Proposition & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* System Status Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121217] border border-[#1f1f26] text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">
              <span className="w-2 h-2 rounded-full bg-[#dfff00]" aria-hidden="true" />
              <span className="text-[#dfff00] font-bold">IRONX</span>
              <span className="text-[#3f3f46]">/</span>
              <span>2026 TRAINING SEASON</span>
            </div>

            {/* Flagship Headline with Stable 4-Line Architectural Stack */}
            <h1 className="text-2xl min-[360px]:text-3xl sm:text-6xl lg:text-7xl font-black uppercase text-white leading-[0.95] tracking-tight font-heading break-words">
              <span className="block">FORGE</span>
              <span className="block">UNCOMPROMISING</span>
              <span className="block">ATHLETIC</span>
              <span className="block text-[#dfff00]">
                <RotatingText
                  texts={["POWER", "PRECISION", "SPEED", "DOMINANCE"]}
                  className="text-[#dfff00] drop-shadow-[0_0_25px_rgba(223,255,0,0.35)]"
                  interval={2600}
                />
              </span>
            </h1>

            {/* Subordinate Supporting Copy - Static & Constant */}
            <p className="text-base sm:text-lg text-[#a1a1aa] max-w-xl font-normal leading-relaxed">
              Biomechanical precision, periodized strength protocols, and real-time kinematic telemetry. Elite coaching. Zero contract traps. Total performance.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to="/pricing">
                <Button variant="volt" size="lg" className="gap-2.5">
                  Claim Membership <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/classes">
                <Button variant="secondary" size="lg" className="gap-2.5">
                  <Calendar className="w-4 h-4 text-[#a1a1aa]" aria-hidden="true" /> Explore Schedule
                </Button>
              </Link>
            </div>

            {/* Authentic Architectural Facility Highlights with CountUp */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-8 border-t border-[#1f1f26] max-w-lg w-full">
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-black text-white font-heading flex items-baseline gap-1 truncate">
                  <CountUp end={3} duration={1.5} /> <span>VAULTS</span>
                </div>
                <div className="text-[10px] sm:text-xs text-[#71717a] font-mono uppercase tracking-wider mt-0.5 break-words">
                  Iron • Combat • Turf
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-black text-white font-heading truncate">
                  IPF & IWF
                </div>
                <div className="text-[10px] sm:text-xs text-[#71717a] font-mono uppercase tracking-wider mt-0.5 break-words">
                  Calibrated Eleiko
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-black text-white font-heading flex items-baseline gap-0.5 truncate">
                  <CountUp end={24} duration={2} />/7
                </div>
                <div className="text-[10px] sm:text-xs text-[#71717a] font-mono uppercase tracking-wider mt-0.5 break-words">
                  Digital Pass Entry
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Impact Athletic Action & Telemetry Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
            <div className="relative w-full max-w-[480px] rounded-3xl overflow-hidden border border-[#272736] bg-[#0c0c10] shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(223,255,0,0.1)] group">
              <img
                src="/vortex-auth-bg.jpg"
                alt="IRONX Athlete in High Performance Conditioning"
                className="w-full h-[400px] sm:h-[460px] object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-95 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/30 to-transparent" />

              {/* Top Floating Telemetry Chip */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#08080a]/85 backdrop-blur-md border border-[#2e2e38] text-[11px] font-mono font-bold text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#dfff00] animate-pulse" />
                  <span>BIOMETRIC TELEMETRY: 98.4%</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#dfff00] text-[#08080a] font-mono text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(223,255,0,0.5)]">
                  LIVE
                </div>
              </div>

              {/* Bottom HUD Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#08080a]/90 backdrop-blur-md border border-[#1f1f26] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#dfff00] uppercase tracking-wider block font-semibold">
                    ACTIVE PROTOCOL
                  </span>
                  <span className="text-sm font-bold text-white uppercase font-heading">
                    Zone 4 Hypertrophy & Power
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
                    Telemetry Sync
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Optimal // 0.01s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ========================================================================= */}
      {/* 2. PERFORMANCE METHODOLOGY (REACT BITS MAGIC BENTO)                       */}
      {/* ========================================================================= */}
      <section id="programs" aria-labelledby="methodology-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SectionReveal>
          <div className="max-w-3xl mb-12 sm:mb-16 space-y-3">
            <Badge variant="volt">ATHLETIC METHODOLOGY</Badge>
            <h2 id="methodology-heading" className="sr-only">
              NOT JUST A GYM. A HIGH-OUTPUT PERFORMANCE SYSTEM.
            </h2>
            <div>
              <VariableProximity
                text="NOT JUST A GYM. A HIGH-OUTPUT PERFORMANCE SYSTEM."
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight font-heading"
                minWeight={700}
                maxWeight={900}
                radius={120}
              />
            </div>
            <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed">
              Every square foot and digital protocol is engineered to eliminate friction, enforce biomechanical integrity, and accelerate physical adaptation.
            </p>
          </div>
        </SectionReveal>

        {/* React Bits: MagicBento Grid with cursor spotlight, volt glow, and 3D tilt */}
        <SectionReveal delay={0.05}>
          <MagicBento
            items={methodologyBentoItems}
            gridClassName="grid-cols-1 lg:grid-cols-3 gap-6"
            glowColor="223, 255, 0"
          />
        </SectionReveal>
      </section>

      {/* ========================================================================= */}
      {/* 3. ENGINEERED CLASSES SPOTLIGHT                                           */}
      {/* ========================================================================= */}
      <section id="classes" aria-labelledby="classes-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SectionReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <Badge variant="volt" className="mb-2.5">LIVE RESERVATIONS</Badge>
              <h2
                id="classes-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight font-heading"
              >
                ENGINEERED TRAINING PROTOCOLS
              </h2>
            </div>
            <Link to="/classes">
              <Button variant="outline" size="sm" className="gap-2">
                Full Weekly Schedule <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredClasses.map((item, idx) => (
            <SectionReveal key={item.id} delay={idx * 0.08}>
              <div className="group rounded-2xl border border-[#1f1f26] bg-[#121217] overflow-hidden hover:border-[#2e2e38] transition-all duration-300 flex flex-col h-full">
                {/* Visual Header with Real Image & Metadata Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#08080a]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/40 to-transparent" />
                  
                  {/* Top Tags */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="volt">{item.category}</Badge>
                    <Badge variant="default">{item.durationMinutes} MIN</Badge>
                  </div>

                  {/* Room & Time Metadata */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#f4f4f5]">
                    <span className="font-mono text-[#dfff00] font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {item.startTime}
                    </span>
                    <span className="text-[#a1a1aa] flex items-center gap-1 truncate max-w-[160px]">
                      <MapPin className="w-3 h-3 text-[#71717a] shrink-0" aria-hidden="true" /> {item.room}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase font-heading group-hover:text-[#dfff00] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Coach Row & Booking Action */}
                  <div className="pt-4 border-t border-[#1f1f26] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.trainerAvatar}
                        alt={item.trainerName}
                        className="w-8 h-8 rounded-full object-cover border border-[#1f1f26] shrink-0"
                      />
                      <div className="truncate">
                        <span className="text-[11px] text-[#71717a] block leading-none">Coach</span>
                        <span className="text-xs text-[#f4f4f5] font-semibold truncate block">
                          {item.trainerName}
                        </span>
                      </div>
                    </div>
                    <Link to="/classes">
                      <Button variant="volt" size="sm">
                        Reserve
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MASTER COACHING FACULTY                                               */}
      {/* ========================================================================= */}
      <section id="trainers" aria-labelledby="coaching-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SectionReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <Badge variant="volt" className="mb-2.5">FACULTY CREDENTIALS</Badge>
              <h2
                id="coaching-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight font-heading"
              >
                MASTER ATHLETIC COACHES
              </h2>
            </div>
            <Link to="/trainers">
              <Button variant="outline" size="sm" className="gap-2">
                Full Coaching Faculty <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTrainers.map((trainer, idx) => (
            <SectionReveal key={trainer.id} delay={idx * 0.08}>
              <div className="group rounded-2xl border border-[#1f1f26] bg-[#121217] overflow-hidden hover:border-[#2e2e38] transition-all duration-300 flex flex-col h-full">
                {/* Authentic Editorial Athletic Portrait */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#08080a]">
                  <img
                    src={trainer.avatarUrl}
                    alt={trainer.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/20 to-transparent" />
                  
                  {/* Verified Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="volt" className="flex items-center gap-1 font-mono">
                      <Star className="w-3 h-3 fill-[#dfff00] text-[#dfff00]" aria-hidden="true" /> {trainer.rating}
                    </Badge>
                  </div>

                  {/* Name Overlay in Portrait Bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-heading leading-none">
                      {trainer.fullName}
                    </h3>
                    <p className="text-xs text-[#dfff00] font-mono uppercase tracking-wider mt-1 font-medium">
                      {trainer.title}
                    </p>
                  </div>
                </div>

                {/* Specialties & Experience Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-wider block mb-2">
                      Specialized Disciplines
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-[#0d0d11] border border-[#1f1f26] text-[11px] text-[#a1a1aa] font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1f1f26] flex items-center justify-between text-xs text-[#a1a1aa]">
                    <span className="font-mono text-white font-semibold">
                      {trainer.experienceYears} Years Dedicated Experience
                    </span>
                    <Link
                      to="/trainers"
                      className="text-[#dfff00] font-bold hover:text-[#ebff33] inline-flex items-center gap-1"
                    >
                      Credentials <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VERIFIED ATHLETE PROOF & FIELD REPORTS                                */}
      {/* ========================================================================= */}
      <section id="gallery" aria-labelledby="reports-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SectionReveal>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <Badge variant="volt">PERFORMANCE OUTCOMES</Badge>
            <h2
              id="reports-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight font-heading"
            >
              VERIFIED ATHLETE FIELD REPORTS
            </h2>
            <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed">
              Unfiltered feedback from competitive powerlifters, combat athletes, and members training under IRONX protocols.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredReviews.map((review, idx) => (
            <SectionReveal key={review.id} delay={idx * 0.08}>
              <div className="rounded-2xl border border-[#1f1f26] bg-[#0d0d11] p-6 sm:p-7 flex flex-col justify-between space-y-6 h-full">
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#dfff00]" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#dfff00]" aria-hidden="true" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-sm sm:text-base text-[#f4f4f5] leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Athlete Metadata */}
                <div className="pt-5 border-t border-[#1f1f26] flex items-center gap-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-9 h-9 rounded-full object-cover border border-[#1f1f26]"
                  />
                  <div>
                    <span className="text-sm font-bold text-white block leading-snug font-heading">
                      {review.userName}
                    </span>
                    <span className="text-[11px] font-mono text-[#dfff00] uppercase tracking-wider block">
                      Active Member • {review.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MEMBERSHIP TIERS (TRANSPARENT PRICING ARCHITECTURE)                    */}
      {/* ========================================================================= */}
      <section id="pricing" aria-labelledby="pricing-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SectionReveal>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3">
            <Badge variant="volt">MEMBERSHIP ARCHITECTURE</Badge>
            <h2
              id="pricing-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight font-heading"
            >
              TRANSPARENT TIERS. ZERO CONTRACT TRAPS.
            </h2>
            <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed">
              Select the tier aligned with your athletic objectives. Upgrade, pause, or cancel anytime with 1-click in your athlete portal.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch perspective-[1200px] pt-4 sm:pt-6">
          {plans.map((plan, idx) => {
            const isFeatured = plan.isFeatured;
            const isTitan = plan.tier === "titan-all-access";

            return (
              <SectionReveal key={plan.id} delay={idx * 0.08} className="h-full">
                <div
                  className={`group relative rounded-[28px] p-7 sm:p-9 flex flex-col justify-between h-full transform-gpu transition-all duration-500 ease-out hover:-translate-y-3 cursor-default ${
                    isFeatured
                      ? "lg:-translate-y-2 bg-gradient-to-b from-[#181822] via-[#101017] to-[#07070a] border-2 border-[#dfff00] shadow-[0_15px_40px_rgba(223,255,0,0.15),0_0_60px_rgba(223,255,0,0.1)] hover:shadow-[0_30px_70px_rgba(223,255,0,0.3),0_0_80px_rgba(223,255,0,0.2)]"
                      : isTitan
                      ? "bg-gradient-to-b from-[#14141e] via-[#0c0c12] to-[#070709] border border-[#272736] hover:border-[#4d4d68] shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,255,255,0.06)]"
                      : "bg-gradient-to-b from-[#121218] via-[#0b0b10] to-[#070709] border border-[#1f1f29] hover:border-[#38384a] shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(223,255,0,0.06)]"
                  }`}
                >
                  {/* 3D Specular Radial Top Glow */}
                  <div
                    className={`absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-500 ${
                      isFeatured
                        ? "bg-[radial-gradient(ellipse_at_top,_rgba(223,255,0,0.12),_transparent_70%)] opacity-100"
                        : "bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_70%)] opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {/* Floating 3D Badge on Featured Card */}
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#dfff00] text-[#08080a] text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-black uppercase font-mono tracking-wider sm:tracking-widest px-3 sm:px-5 py-1.5 rounded-full shadow-[0_0_25px_rgba(223,255,0,0.7)] flex items-center gap-1.5 z-30 whitespace-nowrap border-2 border-[#08080a] max-w-[92%] justify-center">
                      <Sparkles className="w-3.5 h-3.5 fill-[#08080a] shrink-0" aria-hidden="true" />
                      <span className="truncate">RECOMMENDED ATHLETE TIER</span>
                    </div>
                  )}

                  <div className="space-y-6 z-10">
                    {/* Top Tier Header Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-2 min-h-[30px]">
                      <span className="text-[10px] font-mono uppercase tracking-wider sm:tracking-widest px-2.5 sm:px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-bold group-hover:border-[#dfff00]/40 transition-colors shadow-inner truncate">
                        {plan.tier === "starter" ? "TIER 01 / FOUNDATION" : isFeatured ? "TIER 02 / PRO ATHLETE" : "TIER 03 / ALL-ACCESS"}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2.5 sm:px-3 py-0.5 rounded-full shrink-0">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                        Live Roster
                      </span>
                    </div>

                    {/* Plan Name & Tagline */}
                    <div>
                      <h3 className="text-2xl min-[360px]:text-3xl sm:text-4xl font-black uppercase text-white font-heading tracking-tight transition-colors duration-300 group-hover:text-[#dfff00] break-words">
                        {plan.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 min-h-[40px] leading-relaxed">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* 3D Recessed Price Vault */}
                    <div className="bg-[#060609]/95 rounded-2xl p-5 border border-[#1b1b24] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] group-hover:border-[#2a2a38] transition-colors flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#dfff00] font-mono">$</span>
                        <span className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight">
                          {plan.priceMonthly}
                        </span>
                        <span className="text-xs text-[#71717a] font-mono font-medium ml-1">
                          / month
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#121218] border border-[#20202c]">
                        Monthly
                      </span>
                    </div>

                    {/* Included Privileges with 3D Glowing Bead Icons */}
                    <div className="space-y-3.5 pt-2">
                      <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest block font-bold">
                        Enrolled Privileges ({plan.features.length})
                      </span>
                      <ul className="space-y-3 text-xs sm:text-sm text-[#f4f4f5]">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-3 group/item">
                            <div className="w-5 h-5 rounded-full bg-[#dfff00]/10 border border-[#dfff00]/30 flex items-center justify-center text-[#dfff00] shrink-0 mt-0.5 group-hover:bg-[#dfff00] group-hover:text-[#08080a] transition-all duration-300 shadow-[0_0_8px_rgba(223,255,0,0.15)] group-hover:shadow-[0_0_12px_rgba(223,255,0,0.6)]">
                              <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                            </div>
                            <span className="text-xs sm:text-sm leading-relaxed text-[#d4d4d8] group-hover/item:text-white transition-colors">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tactile 3D Action Button */}
                  <div className="pt-7 mt-7 border-t border-[#1b1b24] z-10">
                    <Link to="/pricing" className="block w-full">
                      <Button
                        variant={isFeatured ? "volt" : "secondary"}
                        className={`w-full gap-2 min-h-[52px] text-sm font-black uppercase tracking-wider rounded-2xl transition-all duration-300 active:scale-[0.98] ${
                          isFeatured
                            ? "bg-[#dfff00] text-[#08080a] hover:bg-[#eeff55] shadow-[0_6px_30px_rgba(223,255,0,0.4)] hover:shadow-[0_10px_45px_rgba(223,255,0,0.65)] hover:scale-[1.02]"
                            : "bg-[#111117] border-[#22222f] text-white hover:bg-[#181822] hover:border-[#dfff00] hover:text-[#dfff00] hover:shadow-[0_6px_25px_rgba(0,0,0,0.6)]"
                        }`}
                        size="lg"
                      >
                        <span>Select {plan.name}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FLAGSHIP CLOSING CTA (THE ATHLETIC STANDARD - REACT BITS CURSOR GRID) */}
      {/* ========================================================================= */}
      <section id="about" aria-labelledby="cta-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="relative rounded-2xl border border-[#1f1f26] bg-[#0d0d11] p-8 sm:p-14 lg:p-16 text-center space-y-6 overflow-hidden">
            {/* React Bits: Interactive CursorGrid Background */}
            <CursorGrid
              color="#dfff00"
              cellSize={36}
              radius={160}
              gridOpacity={0.05}
              glowOpacity={0.2}
              className="absolute inset-0 pointer-events-none"
            />

            <div className="relative z-10 space-y-6">
              {/* Structural Accent Marker with TextPressure */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121217]/90 border border-[#1f1f26] text-xs font-mono uppercase tracking-widest text-[#a1a1aa] shadow-md backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                <span className="text-[#71717a]">THE</span>
                <TextPressure
                  text="IRONX"
                  textColor="#dfff00"
                  minFontSize={12}
                  maxFontSize={14}
                  minWeight={700}
                  maxWeight={900}
                  radius={60}
                  className="inline-block tracking-widest font-black"
                />
                <span>STANDARD</span>
              </div>

              <h2
                id="cta-heading"
                className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white max-w-3xl mx-auto leading-[1.0] tracking-tight font-heading"
              >
                YOUR HIGHEST STANDARD OF PERFORMANCE STARTS TODAY.
              </h2>

              <p className="text-[#a1a1aa] max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Experience calibrated competition equipment, dedicated master coaching, and an uncompromising community of high-output athletes.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link to="/pricing">
                  <Button variant="volt" size="lg" className="gap-2.5">
                    Claim Membership <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary" size="lg">
                    Schedule Facility Tour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}

