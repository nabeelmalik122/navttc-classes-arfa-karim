import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUpRight, ShieldCheck, Dumbbell, ChevronUp } from "lucide-react";
import { IronyxLogo } from "@/components/ui/IronyxLogo";
import { scrollToTop } from "@/components/ui/ScrollToTopButton";

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.895-.798-1.5-1.785-1.675-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.233-.244-.585-.492-.505-.677-.515l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509s1.078 2.909 1.228 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.251-.702.251-1.304.176-1.43-.076-.126-.276-.201-.577-.351zM12.054 2C6.541 2 2.067 6.474 2.067 11.987c0 1.956.564 3.784 1.542 5.336L2 22l4.832-1.57a9.92 9.92 0 0 0 5.222 1.481h.004c5.513 0 9.987-4.475 9.987-9.988 0-2.67-1.04-5.18-2.93-7.07A9.927 9.927 0 0 0 12.054 2zm0 18.23h-.003a8.27 8.27 0 0 1-4.218-1.154l-.302-.18-3.136 1.018 1.04-3.056-.197-.314A8.253 8.253 0 0 1 3.82 11.987c0-4.54 3.694-8.235 8.238-8.235 2.2 0 4.268.857 5.824 2.413 1.556 1.556 2.413 3.624 2.413 5.824 0 4.54-3.694 8.241-8.241 8.241z"/>
  </svg>
);

export const PublicFooter: React.FC = () => {
  return (
    <footer
      aria-label="Site Footer"
      className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-secondary)] pt-16 pb-12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--color-border-subtle)]">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              onClick={() => scrollToTop(true)}
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] rounded-xl p-1 -m-1 inline-flex"
              aria-label="IRONX Home"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] flex items-center justify-center group-hover:border-[#dfff00] transition-colors text-[#dfff00]">
                <IronyxLogo className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-wider text-[var(--color-text-primary)] font-['Outfit'] uppercase">
                IRONX
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
              The premier athletic performance ecosystem and gym management operating platform. Engineered for discipline, biomechanical optimization, and uncompromising strength.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-[var(--color-text-muted)] pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#dfff00]" aria-hidden="true" /> NSCA & USAW Certified
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#dfff00]" aria-hidden="true" /> Eleiko & Hammer Strength
              </span>
            </div>
          </div>

          {/* Facilities & Training */}
          <nav aria-label="Facilities & Training Links">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-text-primary)] mb-4">
              Facilities & Training
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Athletic Programs", href: "/programs" },
                { label: "Class Schedule", href: "/classes" },
                { label: "Master Coaches", href: "/trainers" },
                { label: "Facility Tour", href: "/gallery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => scrollToTop(true)}
                    className="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#dfff00] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Membership & Portals */}
          <nav aria-label="Membership & Portals Links">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-text-primary)] mb-4">
              Membership & Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/pricing" onClick={() => scrollToTop(true)} className="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#dfff00] rounded">
                  Membership Tiers
                </Link>
              </li>
              {[
                { label: "Athlete Portal", href: "/member/dashboard" },
                { label: "Trainer Hub", href: "/trainer/dashboard" },
                { label: "Admin Console", href: "/admin/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => scrollToTop(true)}
                    className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#dfff00] rounded"
                  >
                    {link.label} <ArrowUpRight className="w-3 h-3 text-[var(--color-text-muted)]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Headquarters Location & Hours */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-text-primary)] mb-4">
              Location & Hours
            </h4>
            <ul className="space-y-3 text-xs text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#dfff00] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">Armour Colony, Nowshera, Pakistan</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#dfff00] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-1.5">
                  <a
                    href="tel:+923079009095"
                    className="hover:text-white transition-colors font-mono tracking-wide"
                  >
                    +92 307 9009095
                  </a>
                  <a
                    href="https://wa.me/923079009095"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/25 hover:bg-[#25D366]/20 transition-colors font-medium text-[11px] w-fit cursor-pointer"
                    title="Chat with us on WhatsApp"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#dfff00] shrink-0" aria-hidden="true" />
                <a
                  href="mailto:maliknabeelkhattak@gmail432.com"
                  className="hover:text-white transition-colors break-all"
                >
                  maliknabeelkhattak@gmail432.com
                </a>
              </li>
              <li className="pt-2 text-[var(--color-text-muted)] font-mono text-[11px]">
                Open 24/7 for Titan Members
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Google Maps Facility Embed */}
        <div className="py-8 sm:py-10 border-b border-[var(--color-border-subtle)]">
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] p-4 sm:p-5 shadow-2xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 px-1">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#dfff00] animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
                  Facility Location & Satellite Map
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
                <MapPin className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                <span>Armour Colony, Nowshera, Pakistan</span>
              </div>
            </div>

            <div className="relative w-full rounded-xl overflow-hidden border border-[#1f1f26] bg-[#08080a] shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5040.6273823963!2d71.97800778874283!3d33.97404564010499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ded36c42a9fe5f%3A0xebffbb0ce10e40f!2sArmour%20Colony%2C%20Nowshera%2C%20Pakistan!5e1!3m2!1sen!2s!4v1788720298779!5m2!1sen!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="IRONX location on Google Maps"
                className="w-full h-[250px] sm:h-[300px] md:h-[320px] block filter contrast-[1.03]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-text-muted)] gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} IRONX. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer">Privacy Charter</span>
            <span className="hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer">Access Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
