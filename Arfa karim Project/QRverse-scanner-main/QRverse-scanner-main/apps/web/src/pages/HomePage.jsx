import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import QRStudio from '@/components/QRStudio';
import { CATEGORIES } from '@/lib/qrCategories';
import {
  QrCode, Moon, Sun, Infinity as InfinityIcon, Gift, Sparkles, ShieldCheck,
  Zap, Smartphone, Eye, ImageDown, Type as TypeIcon, Palette, Download, ArrowRight
} from 'lucide-react';

const FEATURES = [
  { icon: InfinityIcon, title: 'Unlimited generation', desc: 'Make as many codes as you want. No caps, no throttling, ever.' },
  { icon: Gift, title: 'Completely free', desc: 'Every type, every style, every export — zero cost, no paywall.' },
  { icon: ImageDown, title: 'High-resolution export', desc: 'Crisp PNG, JPG, WebP and infinite-scale SVG for print or web.' },
  { icon: Sparkles, title: 'No registration', desc: 'Skip the sign-up. Generate and download in a single tab.' },
  { icon: Eye, title: 'Live preview', desc: 'Watch the code redraw instantly as you type and restyle.' },
  { icon: Smartphone, title: 'Mobile friendly', desc: 'A responsive studio that works beautifully on any screen.' },
  { icon: ShieldCheck, title: 'Private & secure', desc: 'Everything runs in your browser. Your data never leaves it.' },
  { icon: Zap, title: 'Fast processing', desc: 'Rendered on-device — no servers, no waiting, no latency.' },
];

const STEPS = [
  { n: '01', icon: TypeIcon, title: 'Enter your content', desc: 'Pick from 27 types — URL, WiFi, vCard, UPI, socials and more.' },
  { n: '02', icon: Palette, title: 'Customize the look', desc: 'Colors, gradients, dot & corner shapes, margin, and your logo.' },
  { n: '03', icon: Download, title: 'Download & share', desc: 'Export in PNG, JPG, WebP or SVG and use it anywhere.' },
];

const FAQS = [
  { q: 'Is QRVerse really free?', a: 'Yes. Every QR type, all customization options, and all standard download formats are completely free with no account required.' },
  { q: 'Do QR codes expire?', a: 'No. QRVerse creates static QR codes that encode your data directly, so they work forever and never expire.' },
  { q: 'Can I add my logo?', a: 'Absolutely. Upload any image as a center logo. We recommend a higher error-correction level when adding logos for reliable scanning.' },
  { q: 'Is my data private?', a: 'Completely. QR codes are generated entirely in your browser — nothing you type is ever uploaded to a server.' },
];

const ARTICLES = [
  { t: 'What is a QR Code?', d: 'A plain-language intro to how these little squares store data.', tag: 'Basics' },
  { t: 'Static vs Dynamic QR Codes', d: 'Which one fits your campaign, and the trade-offs of each.', tag: 'Guide' },
  { t: 'QR Codes for Restaurants', d: 'Contactless menus, reviews and table ordering done right.', tag: 'Business' },
  { t: 'Best QR Code Practices', d: 'Sizing, contrast and error correction for flawless scans.', tag: 'Tips' },
];

export default function HomePage() {
  const { theme, toggle } = useTheme();

  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const appSchema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'QRVerse', applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online QR code generator with live preview, customization and high-resolution downloads.',
  };

  return (
    <div className="relative min-h-screen overflow-clip">
      <Helmet>
        <title>QRVerse — Free QR Code Generator | Create Custom QR Codes Online</title>
        <meta name="description" content="Generate beautiful, high-resolution QR codes free and instantly. 27 types including URL, WiFi, vCard, UPI and socials. Custom colors, logos, gradients — no sign-up." />
        <meta name="keywords" content="QR code generator, free QR code generator, create QR code, QR maker, WiFi QR code, WhatsApp QR code, custom QR code, QR code online" />
        <link rel="canonical" href="https://qrverse.app/" />
        <meta property="og:title" content="QRVerse — Free QR Code Generator" />
        <meta property="og:description" content="Create custom, high-resolution QR codes in seconds. Free, private and no registration required." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QRVerse — Free QR Code Generator" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
      </Helmet>

      {/* animated background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-blob" />
        <div className="absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[80rem] items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
              <QrCode className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="text-lg font-bold tracking-tight">QR<span className="text-gradient">Verse</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#studio" className="hover:text-foreground">Generator</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#learn" className="hover:text-foreground">Learn</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggle} aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-secondary">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a href="#studio" className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90 sm:block">
              Generate free
            </a>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-[80rem] px-5 pt-16 pb-10 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> 27 QR types · zero sign-up · always free
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Generate <span className="text-gradient">beautiful QR codes</span> in seconds
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              A futuristic, privacy-first QR studio. Design custom codes with gradients, logos and shapes — then export in crystal-clear resolution. No account, no limits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#studio" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90 active:scale-[0.98]">
                Start generating <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary">
                See features
              </a>
            </div>
            <div className="mt-8 flex gap-8 text-sm">
              <div><p className="text-2xl font-bold">27+</p><p className="text-muted-foreground">QR types</p></div>
              <div><p className="text-2xl font-bold">5</p><p className="text-muted-foreground">Export formats</p></div>
              <div><p className="text-2xl font-bold">$0</p><p className="text-muted-foreground">Forever</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="glass relative rounded-[2rem] p-8">
            <div className="mx-auto grid h-64 w-64 place-items-center rounded-3xl bg-gradient-to-br from-primary via-fuchsia-500 to-accent p-1 shadow-2xl shadow-primary/30">
              <div className="grid h-full w-full place-items-center rounded-[1.4rem] bg-background">
                <QrCode className="h-32 w-32 text-foreground" strokeWidth={1.2} />
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">Live preview updates as you build ↓</p>
          </motion.div>
        </div>
      </section>

      {/* marquee */}
      <div className="relative my-6 flex overflow-hidden border-y border-border/60 py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <c.icon className="h-4 w-4 text-primary" /> {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* studio */}
      <section id="studio" className="mx-auto max-w-[80rem] px-5 py-16">
        <SectionHead eyebrow="The Studio" title="Build your QR code" sub="Choose a type, add your details, style it, and download. Everything happens instantly in your browser." />
        <div className="mt-10"><QRStudio /></div>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-[80rem] px-5 py-16">
        <SectionHead eyebrow="Why QRVerse" title="Everything you need, nothing you don't" sub="Powerful enough for marketing teams, simple enough for a one-off code." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              className="glass rounded-2xl p-5">
              <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-[80rem] px-5 py-16">
        <SectionHead eyebrow="How it works" title="Three steps to a scannable code" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(s => (
            <div key={s.n} className="glass relative overflow-hidden rounded-2xl p-6">
              <span className="absolute -right-2 -top-4 text-7xl font-bold text-primary/10">{s.n}</span>
              <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* categories grid */}
      <section className="mx-auto max-w-[80rem] px-5 py-16">
        <SectionHead eyebrow="Popular categories" title="One generator for every use case" sub="From WiFi and vCards to UPI payments and every social platform." />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.map(c => (
            <a key={c.id} href="#studio"
              className="glass group flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition hover:-translate-y-1 hover:border-primary/50">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium">{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* learn / blog */}
      <section id="learn" className="mx-auto max-w-[80rem] px-5 py-16">
        <SectionHead eyebrow="Learn" title="Guides & QR know-how" sub="Get more from your codes with practical, jargon-free reading." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARTICLES.map(a => (
            <article key={a.t} className="glass group flex flex-col rounded-2xl p-5 transition hover:-translate-y-1">
              <span className="mb-3 w-fit rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">{a.tag}</span>
              <h3 className="text-base font-semibold group-hover:text-gradient">{a.t}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.d}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Read more <ArrowRight className="h-3.5 w-3.5" /></span>
            </article>
          ))}
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="mx-auto max-w-[56rem] px-5 py-16">
        <SectionHead eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-10 space-y-3">
          {FAQS.map(f => (
            <details key={f.q} className="glass group rounded-2xl p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
                {f.q}
                <span className="ml-4 text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-[80rem] px-5 py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-fuchsia-600 to-accent p-10 text-center text-white md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to make your first QR code?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">No account, no cost, no watermark. Just a beautiful code in seconds.</p>
          <a href="#studio" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-xl transition hover:scale-[1.02] active:scale-95">
            Open the studio <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto grid max-w-[80rem] gap-8 px-5 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                <QrCode className="h-4 w-4" />
              </span>
              <span className="font-bold">QR<span className="text-gradient">Verse</span></span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">The free, private, futuristic QR code generator. Built for everyone.</p>
          </div>
          <FooterCol title="Generator" links={['Website URL', 'WiFi', 'vCard', 'WhatsApp', 'UPI Payment']} />
          <FooterCol title="Learn" links={['What is a QR Code?', 'Static vs Dynamic', 'Best Practices', 'For Business']} />
          <FooterCol title="Company" links={['Help Center', 'Tutorials', 'Privacy', 'Terms']} />
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} QRVerse. All rights reserved. Made with a privacy-first mindset.</p>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</span>
      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(l => <li key={l}><a href="#studio" className="hover:text-foreground">{l}</a></li>)}
      </ul>
    </div>
  );
}
