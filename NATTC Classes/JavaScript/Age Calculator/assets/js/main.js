/* ============================================================
   AGEVAULT — MAIN.JS v3.0
   Midnight+Amber | Clean | Fast | Premium
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
const lerp  = (a, b, t)   => a + (b - a) * t;

function fmtNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return Math.round(n).toLocaleString();
  return String(n);
}
function todayISO() {
  return new Date().toISOString().split('T')[0];
}
function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
function weekdayOf(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/* ─────────────────────────────────────────────────────────────
   1. LOADER  — max 700 ms
───────────────────────────────────────────────────────────── */
(function initLoader() {
  const el = $('#loader');
  if (!el) return;
  const hide = () => {
    el.classList.add('fade-out');
    setTimeout(() => { el.style.display = 'none'; }, 420);
  };
  // Hide after 700 ms OR when page is interactive — whichever first
  if (document.readyState === 'complete') {
    setTimeout(hide, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 200), { once: true });
    setTimeout(hide, 700);
  }
})();

/* ─────────────────────────────────────────────────────────────
   2. THEME  (dark is default — stored in localStorage)
───────────────────────────────────────────────────────────── */
(function initTheme() {
  const btn  = $('#themeToggle');
  const root = document.documentElement;
  const KEY  = 'av-theme';

  const stored    = localStorage.getItem(KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(stored || preferred);

  btn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(KEY, next);
  });

  function applyTheme(t) {
    root.dataset.theme = t;
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) icon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
})();

/* ─────────────────────────────────────────────────────────────
   3. NAVBAR — scroll + mobile
───────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar  = $('#navbar');
  const menuBtn = $('#menuBtn');
  const mobileNav = $('#mobileNav');
  const overlay = $('#overlay');
  const closeBtn = $('#mobileClose');

  // Scroll class
  let tick = false;
  window.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      navbar?.classList.toggle('scrolled', scrollY > 16);
      tick = false;
    });
  }, { passive: true });

  // Highlight active link
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.navbar__link').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.endsWith(page)) a.classList.add('active');
  });

  const open  = () => {
    mobileNav?.classList.add('open');
    overlay?.classList.add('show');
    menuBtn?.classList.add('open');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    mobileNav?.classList.remove('open');
    overlay?.classList.remove('show');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ─────────────────────────────────────────────────────────────
   4. RIPPLE
───────────────────────────────────────────────────────────── */
function addRipple(btn, e) {
  const s   = document.createElement('span');
  const r   = btn.getBoundingClientRect();
  const sz  = Math.max(r.width, r.height);
  const x   = (e ? e.clientX - r.left : r.width  / 2) - sz / 2;
  const y   = (e ? e.clientY - r.top  : r.height / 2) - sz / 2;
  s.className = 'ripple';
  s.style.cssText = `width:${sz}px;height:${sz}px;left:${x}px;top:${y}px`;
  btn.appendChild(s);
  s.addEventListener('animationend', () => s.remove(), { once: true });
}
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (btn) addRipple(btn, e);
}, true);

/* ─────────────────────────────────────────────────────────────
   5. SCROLL ANIMATIONS (AOS replacement — no library)
───────────────────────────────────────────────────────────── */
(function initAOS() {
  const els = $$('[data-aos]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el  = en.target;
      const del = parseInt(el.dataset.aosDelay || '0', 10);
      setTimeout(() => el.classList.add('aos-animate'), del);
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────────────────────────
   6. COUNT-UP  (tabular-safe)
───────────────────────────────────────────────────────────── */
function countUp(el, target, ms = 1200) {
  const start = performance.now();
  const tick  = now => {
    const p = clamp((now - start) / ms, 0, 1);
    const v = Math.round(lerp(0, target, 1 - Math.pow(1 - p, 3)));
    el.textContent = fmtNum(v);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = fmtNum(target);
  };
  requestAnimationFrame(tick);
}

// Hero stats
(function initHeroStats() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      countUp(el, parseInt(el.dataset.count, 10), 1400);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────────────────────────
   7. SMOOTH SCROLL for # anchors
───────────────────────────────────────────────────────────── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = $(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const top = target.getBoundingClientRect().top + scrollY - 72;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ─────────────────────────────────────────────────────────────
   8. SCROLL-TO-TOP BUTTON
───────────────────────────────────────────────────────────── */
(function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;
  let tick = false;
  window.addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      btn.classList.toggle('visible', scrollY > 380);
      tick = false;
    });
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─────────────────────────────────────────────────────────────
   9. FOOTER YEAR
───────────────────────────────────────────────────────────── */
$$('#footerYear').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ─────────────────────────────────────────────────────────────
   10. TOAST
───────────────────────────────────────────────────────────── */
let _toastTimer;
function showToast(msg, type = 'info') {
  const el = $('#toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  const bg = { success: '#10B981', error: '#EF4444', info: '#F59E0B' };
  el.textContent = msg;
  el.style.cssText = `background:${bg[type] || bg.info};color:${type === 'info' ? '#000' : '#fff'}`;
  el.classList.add('show');
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3400);
}
window.showToast = showToast;
