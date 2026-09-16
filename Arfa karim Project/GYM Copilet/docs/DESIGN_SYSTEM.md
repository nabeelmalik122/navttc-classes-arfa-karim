# GymOS Enterprise: Luxury Design System Specification
**Version:** 1.0.0-PROD  
**Design Philosophy:** Awwwards-caliber Kinetic Luxe  
**Inspiration:** Nike (bold energy & typography), Apple (restraint & glassmorphism), Gymshark (athletic intensity), Linear (precision ergonomics & micro-borders), Stripe (fluid typography & ambient lighting).

---

## 1. Typography System

The typography system is engineered around a dual-type identity: **Athletic Kinetic Display** for dramatic, high-energy impact and **Swiss Modernist Sans** for high-density, fatigue-free SaaS telemetry.

### 1.1 Font Families
- **Display Font:** `Syne` (Alternative: `Clash Display`, `Cabinet Grotesk`)
  - *Usage:* Hero headlines, section titles, large metric callouts, marketing badges.
  - *Characteristics:* High geometric contrast, wide proportion, aggressive kinetic letterforms.
- **UI / Body Font:** `Plus Jakarta Sans` (Alternative: `Inter`, `Geist Sans`)
  - *Usage:* Dashboard navigation, form fields, tabular data, body copy, descriptions.
  - *Characteristics:* Wide aperture, tall x-height, optimized for micro-legibility on OLED displays.
- **Monospace Font:** `JetBrains Mono`
  - *Usage:* Financial metrics, timestamps, stopwatch intervals, barcode identifiers, telemetry HUD values.
  - *Characteristics:* Tabular figures, distinct glyph separation, unambiguous zeroes.

### 1.2 Fluid Typography Scale (CSS Clamp)
Fluid typography eliminates abrupt breakpoint jumps by computing smooth viewport transitions using CSS `clamp()`:

| Token | Min Size | Max Size | Formula | Line Height | Letter Spacing | Font Family | Default Weight |
|---|---|---|---|---|---|---|---|
| `display-2xl` | 48px | 96px | `clamp(3.00rem, 2.0rem + 5vw, 6.00rem)` | 0.95 | -0.04em | Display | 800 (Extrabold) |
| `display-xl` | 40px | 72px | `clamp(2.50rem, 1.7rem + 4vw, 4.50rem)` | 1.00 | -0.035em | Display | 800 (Extrabold) |
| `display-lg` | 32px | 56px | `clamp(2.00rem, 1.4rem + 3vw, 3.50rem)` | 1.05 | -0.03em | Display | 700 (Bold) |
| `heading-xl` | 28px | 40px | `clamp(1.75rem, 1.3rem + 2.2vw, 2.50rem)` | 1.15 | -0.025em | Display | 700 (Bold) |
| `heading-lg` | 24px | 32px | `clamp(1.50rem, 1.2rem + 1.5vw, 2.00rem)` | 1.20 | -0.02em | Display / UI | 600 (Semibold) |
| `heading-md` | 20px | 24px | `clamp(1.25rem, 1.1rem + 0.75vw, 1.50rem)` | 1.25 | -0.015em | UI | 600 (Semibold) |
| `heading-sm` | 18px | 20px | `clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)` | 1.30 | -0.01em | UI | 600 (Semibold) |
| `body-lg` | 16px | 18px | `clamp(1.00rem, 0.95rem + 0.25vw, 1.125rem)` | 1.55 | -0.005em | UI | 400 / 500 |
| `body-md` | 14px | 15px | `clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem)` | 1.50 | 0.00em | UI | 400 / 500 |
| `body-sm` | 12px | 13px | `clamp(0.75rem, 0.73rem + 0.10vw, 0.8125rem)` | 1.45 | +0.01em | UI | 400 / 500 |
| `caption` | 11px | 11px | `0.6875rem` | 1.40 | +0.03em | UI / Mono | 600 (Uppercase) |
| `mono-lg` | 24px | 32px | `clamp(1.50rem, 1.2rem + 1.5vw, 2.00rem)` | 1.10 | -0.02em | Mono | 700 (Bold) |
| `mono-md` | 14px | 16px | `clamp(0.875rem, 0.85rem + 0.2vw, 1.00rem)` | 1.20 | 0.00em | Mono | 500 (Medium) |
| `mono-sm` | 11px | 12px | `0.75rem` | 1.20 | +0.02em | Mono | 500 (Medium) |

---

## 2. Color System

The palette adopts a **Dark Luxe 60-30-10 Principle**:
- **60% Void & Obsidian Substrates:** Deep absorbing blacks that provide maximum contrast without harsh pure-black eye strain.
- **30% Carbon & Titanium Structural Layers:** Controlled subtle elevations, micro-borders, and muted text hierarchies.
- **10% Kinetic Neons:** Electric high-energy accents (Cyber Lime, Electric Teal) reserved for primary CTAs, active telemetry indicators, and performance peaks.

### 2.1 Color Matrix & Swatches

```
+-----------------------------------------------------------------------------------------+
| VOID BLACK           OBSIDIAN SURFACE      CARBON CARD           CARBON BORDER          |
| #070709              #0D0E12               #14151C               #232533                |
| HSL(240, 18%, 3%)    HSL(228, 16%, 6%)     HSL(233, 16%, 10%)    HSL(233, 18%, 17%)     |
+-----------------------------------------------------------------------------------------+
| CYBER LIME (PRIMARY) ELECTRIC TEAL (DATA)  NEON CRIMSON (DANGER) SAFETY ORANGE (WARN)   |
| #CCFF00              #00F0FF               #FF3366               #FF6B00                |
| HSL(72, 100%, 50%)   HSL(184, 100%, 50%)   HSL(345, 100%, 60%)   HSL(25, 100%, 50%)     |
+-----------------------------------------------------------------------------------------+
| TITANIUM (TEXT)      MUTED LAVENDER        DEEP MUD (BORDER)     PURE WHITE ACCENT      |
| #F5F6FA              #9EA3B5               #5E6377               #FFFFFF                |
| HSL(228, 24%, 97%)   HSL(228, 12%, 67%)    HSL(229, 12%, 42%)    HSL(0, 0%, 100%)       |
+-----------------------------------------------------------------------------------------+
```

### 2.2 Semantic Color Mapping
```css
/* Background Layers */
--color-bg-canvas:       #070709; /* Master window background */
--color-bg-surface-1:    #0D0E12; /* Elevated sidebar, header, navigation sheets */
--color-bg-surface-2:    #14151C; /* Cards, metric modules, table rows */
--color-bg-surface-3:    #1C1E29; /* Hover state, active selected states */
--color-bg-surface-4:    #252837; /* Popovers, tooltips, dialogs */

/* Structural Borders */
--color-border-subtle:   rgba(255, 255, 255, 0.06); /* Dividers, non-interactive bounds */
--color-border-default:  #232533;                   /* Cards, input borders, table borders */
--color-border-hover:    #35384D;                   /* Hover border feedback */
--color-border-active:   rgba(204, 255, 0, 0.40);   /* Focused element border */

/* Foreground Text */
--color-text-primary:    #F5F6FA; /* Headings, primary values */
--color-text-secondary:  #9EA3B5; /* Labels, secondary descriptors */
--color-text-muted:      #5E6377; /* Footnotes, disabled states, placeholders */
--color-text-inverse:    #070709; /* Text placed on bright neon badges/buttons */

/* Functional Accents */
--color-primary:         #CCFF00; /* Cyber Lime */
--color-primary-glow:    rgba(204, 255, 0, 0.25);
--color-secondary:       #00F0FF; /* Electric Teal */
--color-secondary-glow:  rgba(0, 240, 255, 0.25);
--color-danger:          #FF3366; /* Neon Crimson */
--color-danger-glow:     rgba(255, 51, 102, 0.25);
--color-warning:         #FF6B00; /* Safety Orange */
--color-success:         #00FF85; /* Mint Green */
```

### 2.3 Accessibility & Contrast Compliance (WCAG 2.2)
- Text Primary (`#F5F6FA`) on Canvas (`#070709`): **18.2:1** (Exceeds WCAG AAA 7:1)
- Text Secondary (`#9EA3B5`) on Surface (`#14151C`): **7.3:1** (Passes WCAG AAA)
- Primary Accent (`#CCFF00`) with Dark Inverse Text (`#070709`): **16.1:1** (Passes WCAG AAA)
- Interactive states enforce a minimum `3:1` contrast ratio for non-text UI elements.

---

## 3. Design Tokens Architecture

Design tokens are structured as three distinct levels:
1. **Global/Reference Tokens:** Primitive raw color values and math constants.
2. **System/Semantic Tokens:** Intent-based aliases (`surface-card`, `text-primary`).
3. **Component Tokens:** Specific component property contracts (`btn-primary-bg`, `card-hover-border`).

### 3.1 CSS Variables Implementation (`src/index.css`)
```css
@theme {
  /* Colors */
  --color-void: var(--color-bg-canvas);
  --color-obsidian: var(--color-bg-surface-1);
  --color-carbon: var(--color-bg-surface-2);
  --color-carbon-border: var(--color-border-default);
  --color-cyber-lime: var(--color-primary);
  --color-electric-teal: var(--color-secondary);
  --color-neon-crimson: var(--color-danger);

  /* Font Families */
  --font-display: "Syne", "Clash Display", sans-serif;
  --font-body: "Plus Jakarta Sans", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

---

## 4. Spacing Scale

Based on an **8pt Grid Baseline Rhythm** with 4pt half-steps for micro-components.

| Token | Value (Rem) | Pixels | Intent / Primary Usage |
|---|---|---|---|
| `space-0` | `0rem` | 0px | Reset |
| `space-3xs` | `0.125rem` | 2px | Hairline spacing, inner status badge dot gap |
| `space-2xs` | `0.25rem` | 4px | Micro padding, tag gap, status indicator margin |
| `space-xs` | `0.5rem` | 8px | Button inline gap, icon-to-text margin, compact chips |
| `space-sm` | `0.75rem` | 12px | Input interior padding, card header gap, list item gap |
| `space-md` | `1.0rem` | 16px | Standard button padding, modal inner gap, table cell inline |
| `space-lg` | `1.5rem` | 24px | Card container padding, sidebar widget spacing |
| `space-xl` | `2.0rem` | 32px | Dashboard section gap, modal wrapper padding |
| `space-2xl` | `3.0rem` | 48px | Major dashboard block separation, drawer spacing |
| `space-3xl` | `4.0rem` | 64px | Page header bottom margin, landing section rhythm |
| `space-4xl` | `6.0rem` | 96px | Hero banner top/bottom vertical padding |
| `space-5xl` | `8.0rem` | 128px | Landmark marketing section intervals |

---

## 5. Border Radius System

To prevent visual disharmony, all nested corners strictly follow the **Concentric Radius Formula**:
$$\mathbf{R_{\text{inner}} = R_{\text{outer}} - \text{Padding}}$$

| Token | Value | Applied Elements |
|---|---|---|
| `radius-none` | `0px` | Full-bleed elements, flush table dividers |
| `radius-xs` | `4px` | Mini indicators, checkbox boxes, code snippets |
| `radius-sm` | `8px` | Form inputs, select dropdowns, contextual menu items |
| `radius-md` | `12px` | Standard buttons, nested sub-cards, tooltips |
| `radius-lg` | `16px` | Interactive HUD cards, metric widgets, table containers |
| `radius-xl` | `24px` | Large dialogs, modals, floating action bars, sheet headers |
| `radius-2xl` | `32px` | Hero image containers, marketing showcase cards |
| `radius-full` | `9999px` | Pills, status badges, avatar roundels, magnetic pill CTAs |

---

## 6. Shadow & Elevation System

In dark mode, shadows cannot simply be dark blurs; they must combine **Ambient Occlusion**, **Directional Elevation**, and **Rim Lighting (Specular Highlights)**.

```
       [ Specular Top Edge: 1px solid rgba(255,255,255, 0.08) ]
       ┌────────────────────────────────────────────────────────┐
       │                                                        │
       │                   ELEVATED SURFACE                     │
       │                                                        │
       └────────────────────────────────────────────────────────┘
       [ Ambient Occlusion Shadow: rgba(0,0,0, 0.70)             ]
       [ Neon Accent Glow Dispersion: rgba(204,255,0, 0.12)      ]
```

### 6.1 Shadow Scale
- `elevation-0`: Flat surface, no shadow. Border: `1px solid var(--color-border-subtle)`.
- `elevation-1` (Low Card):
  - `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);`
- `elevation-2` (Interactive Hover / Popover):
  - `box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);`
- `elevation-3` (Modal / Dialog / Drawer):
  - `box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12);`
- `elevation-glow-lime` (Active Performance Highlight):
  - `box-shadow: 0 0 25px -3px rgba(204, 255, 0, 0.20), 0 8px 16px -4px rgba(0, 0, 0, 0.7);`
- `elevation-glow-teal` (Telemetry / Active Session):
  - `box-shadow: 0 0 25px -3px rgba(0, 240, 255, 0.20), 0 8px 16px -4px rgba(0, 0, 0, 0.7);`

---

## 7. Glassmorphism & Material Rules

Glassmorphism in GymOS represents **Titanium Frosted Glass** rather than generic translucent white.

### 7.1 Material Specifications
1. **Background Tint:** Deep Obsidian base (`rgba(13, 14, 18, 0.75)`).
2. **Backdrop Blur:** `16px` to `24px` Gaussian blur with `120%` saturation boost to heighten underlying motion.
3. **Edge Highlight:** `1px solid rgba(255, 255, 255, 0.08)` across borders with top-edge specular bias.
4. **Noise Layer:** Subtle SVG grain (opacity `0.025`) overlay to eradicate 8-bit banding on dark OLED displays.
5. **Fallback:** If `backdrop-filter: blur()` is unsupported, degrade gracefully to `background: #0D0E12`.

```css
.glass-surface {
  background: rgba(13, 14, 18, 0.75);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}
```

---

## 8. Layout Grid System

The platform uses an adaptive **12-Column Responsive Grid System** for dashboards and an **Asymmetric Kinetic Grid** for marketing narratives.

### 8.1 Grid Parameters by Breakpoint
| Breakpoint | Viewport Range | Columns | Gutter | Margins / Outer Padding | Layout Type |
|---|---|---|---|---|---|
| `sm` (Mobile) | 320px – 639px | 4 | 16px | 16px | Single-column fluid stack |
| `md` (Tablet) | 640px – 1023px | 8 | 20px | 24px | Dual-column modular flow |
| `lg` (Laptop) | 1024px – 1279px | 12 | 24px | 32px | Persistent sidebar + 12-col workspace |
| `xl` (Desktop) | 1280px – 1599px | 12 | 24px | 40px | Sidebar + multi-column dashboard grid |
| `2xl` (Ultrawide) | 1600px+ | 12 | 32px | 48px | Max-width clamped or fluid multi-pane |

### 8.2 Dashboard Asymmetric Ratios
- **Command Center:** `8 cols (Activity & Analytics)` / `4 cols (Quick Actions & Live Gym Stream)`
- **Class Booking Engine:** `3 cols (Filters & Calendar)` / `9 cols (Class Session Cards)`
- **Workout Routine Builder:** `4 cols (Exercise Library)` / `8 cols (Periodization Timeline)`

---

## 9. Container Width System

```
+-----------------------------------------------------------------------------------+
| Max Full-Bleed (100% Viewport Width)                                             |
|   +-----------------------------------------------------------------------------+ |
|   | Max 2XL Container: 1536px (Ultrawide Telemetry & Master Schedule)           | |
|   |   +-----------------------------------------------------------------------+ | |
|   |   | Max XL Container: 1280px (Standard Dashboard Viewports)               | | |
|   |   |   +-----------------------------------------------------------------+ | | |
|   |   |   | Max LG Container: 1024px (Tablet & Mid-tier Focus Layouts)      | | | |
|   |   |   |   +-----------------------------------------------------------+ | | | |
|   |   |   |   | Max MD Container: 768px (Reading, Article, CRM Profiles)   | | | | |
|   |   |   |   |   +-----------------------------------------------------+ | | | | |
|   |   |   |   |   | Max SM Container: 480px (Auth Cards, Mobile Hub)    | | | | | |
+---+---+---+---+---+---+-----------------------------------------------------+---+---+---+
```

- `container-sm`: `480px` — Login, registration, 2FA, OTP verification modals.
- `container-md`: `768px` — Single athlete detailed medical profile, checkout sheets.
- `container-lg`: `1024px` — Settings forms, workout program editor.
- `container-xl`: `1280px` — Standard SaaS operational views (Members CRM, Financial Ledger).
- `container-2xl`: `1536px` — Master Timetable Matrix, Multi-branch Operations Map.

---

## 10. Button Variants & Interaction Mechanics

Every button is an athletic micro-interaction engine with strict state definitions.

### 10.1 Button Variants Matrix
1. **Primary Kinetic Lime (`btn-primary`):**
   - *Default:* Solid `#CCFF00`, text `#070709`, font-weight 700.
   - *Hover:* Background translates slightly with mouse (`useMagneticEffect`), subtle neon glow `box-shadow: 0 0 20px rgba(204,255,0,0.4)`.
   - *Active:* Scaled down to `0.97`, brightness `95%`.
   - *Disabled:* Background `#232533`, text `#5E6377`, cursor `not-allowed`.
2. **Secondary Obsidian Glass (`btn-secondary`):**
   - *Default:* Background `rgba(20, 21, 28, 0.7)`, border `1px solid #232533`, text `#F5F6FA`.
   - *Hover:* Border `#CCFF00`/30, background `#1B1D28`, text white.
   - *Active:* Background `#14151C`, scale `0.98`.
3. **Tertiary Ghost Wireframe (`btn-ghost`):**
   - *Default:* Transparent background, border `1px solid transparent`, text `#9EA3B5`.
   - *Hover:* Background `rgba(255, 255, 255, 0.05)`, text `#F5F6FA`.
4. **Destructive Crimson (`btn-danger`):**
   - *Default:* Background `rgba(255, 51, 102, 0.12)`, border `1px solid rgba(255, 51, 102, 0.3)`, text `#FF3366`.
   - *Hover:* Solid `#FF3366`, text white, glow `rgba(255, 51, 102, 0.35)`.
5. **Icon Action (`btn-icon`):**
   - Square or round ratio (`36x36px` or `44x44px`), centered icon, glassmorphic hover plate.

### 10.2 Size Scale
- **Compact (`sm`):** Height `32px`, font-size `12px`, padding `0 12px`, radius `8px`.
- **Standard (`md`):** Height `40px`, font-size `14px`, padding `0 18px`, radius `10px`.
- **Hero / Touch (`lg`):** Height `52px`, font-size `16px`, padding `0 28px`, radius `14px`.

---

## 11. Input & Form Control Variants

Forms emphasize clean, high-contrast states with unmistakable focus boundaries.

### 11.1 Input States
- **Default:** Background `#0D0E12`, border `1px solid #232533`, text `#F5F6FA`, placeholder `#5E6377`.
- **Hover:** Border `#35384D`.
- **Focused:** Border `1px solid #CCFF00`, box-shadow `0 0 0 3px rgba(204, 255, 0, 0.15)`.
- **Error:** Border `1px solid #FF3366`, box-shadow `0 0 0 3px rgba(255, 51, 102, 0.15)`.
- **Disabled:** Background `#070709`, border `1px solid #1A1B22`, text `#404352`, cursor `not-allowed`.

### 11.2 Specialized Variants
- **Search HUD Input:** Inset icon with keyboard shortcut badge (e.g. `⌘K` in `#232533` pill).
- **Metric Input:** Fixed unit suffix badge (`kg`, `lbs`, `bpm`, `%`) in monospace font.
- **Floating Label Input:** Label transforms from centered placeholder (`14px`) to top collar (`10px` uppercase) on focus/value presence.

---

## 12. Card Variants

Cards are the foundational surface for the multi-tenant dashboard.

### 12.1 Card Archetypes
1. **Telemetry Metric Card (`card-metric`):**
   - Small, high-density widget displaying a primary KPI (e.g. MRR, Active Members).
   - Top right: Micro status icon or Sparkline SVG.
   - Core: Monospace figure in `mono-lg`.
   - Bottom: Delta comparison badge (`+14.2%` in Lime or `-3.1%` in Crimson).
2. **Interactive Spotlight Card (`card-spotlight`):**
   - Radial gradient follows user's mouse position across the card border:
     `background: radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(204,255,0,0.12), transparent 40%)`.
3. **Session Schedule Card (`card-session`):**
   - Distinct left accent border colored by class category (HIIT = Lime, Strength = Orange, Recovery = Teal).
   - Capacity progress bar showing seats remaining.
4. **Workout Set Card (`card-set`):**
   - Dense table-like layout for set number, weight, reps, RPE, and checkmark toggle.

---

## 13. Modal & Overlay Variants

All overlays trigger a global backdrop blur with animated depth suppression.

### 13.1 Overlay Types
1. **Center Action Dialog:**
   - Width: `480px` to `640px`.
   - Animation: Spring entry from `scale: 0.95, y: 20, opacity: 0` to `scale: 1, y: 0, opacity: 1`.
   - Backdrop: `rgba(7, 7, 9, 0.75)` with `backdrop-filter: blur(12px)`.
2. **Command Palette HUD (`Cmd+K`):**
   - Floating header search at `top: 15%`.
   - Full keyboard navigation (Arrow Up/Down, Enter, Esc).
   - Instant search across members, classes, workouts, and settings.
3. **Side Sheet / Drawer (Right-aligned):**
   - Width: `440px` (desktop) or `100vw` (mobile).
   - Used for: In-depth Member Profile inspection, Class Rosters, Invoice details.
   - Slide-in transition from right (`x: '100%' -> 0%`).
4. **Mobile Bottom Sheet:**
   - Anchored to bottom with drag handle pill (`36x4px`).
   - Swipe-down-to-dismiss gesture support.

---

## 14. Table & Data Grid Variants

Engineered for operations teams processing hundreds of rows daily.

### 14.1 Table Specifications
- **Header:** Sticky top, height `44px`, background `#0D0E12`, typography `caption` uppercase, border-bottom `1px solid #232533`.
- **Row Anatomy:**
  - Height: `56px` (Standard) or `40px` (Dense Mode).
  - Background: Alternating zebra (`#0D0E12` / `#111217`) or uniform `#0D0E12` with hover highlight `#181A24`.
  - Border: `1px solid rgba(255, 255, 255, 0.04)`.
- **Cell Alignment:** Text left-aligned; numerical and monetary data right-aligned in monospace font; status indicators centered.
- **Bulk Action Bar:** Floating bottom pill appears when rows are selected (`3 selected | Freeze | Export | Terminate`).

---

## 15. Status Badge & Micro-Indicator System

Status badges communicate immediate operational conditions using color, text, and radar pulses.

### 15.1 Badge Variants
| Status | Tone | Badge Background | Text Color | Dot Style |
|---|---|---|---|---|
| `Active / Confirmed` | Success | `rgba(0, 255, 133, 0.10)` | `#00FF85` | Solid green + pulsing radar ring |
| `In Progress / Live` | Primary | `rgba(204, 255, 0, 0.12)` | `#CCFF00` | Rapid breathing glow (1.2s cycle) |
| `Waitlisted / Pending` | Warning | `rgba(255, 107, 0, 0.12)` | `#FF6B00` | Static amber dot |
| `Overdue / Terminated` | Danger | `rgba(255, 51, 102, 0.12)` | `#FF3366` | Static crimson dot |
| `Draft / Archived` | Neutral | `rgba(255, 255, 255, 0.08)` | `#9EA3B5` | Static slate dot |

---

## 16. Skeleton Loading System

Skeletons replace raw spinners to prevent cumulative layout shifts (CLS) and maintain visual silhouette.

### 16.1 Skeleton Specs
- **Base Background:** `#14151C`
- **Highlight Shimmer:** `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)`
- **Animation Cycle:** Infinite linear sweep across 1.6s.
- **Matching Geometries:**
  - Avatar: `rounded-full`
  - Text Line: `h-4 rounded-md w-3/4`
  - Metric Card: Full height block with internal cutout geometry

---

## 17. Notification & Feedback System

Multi-tiered feedback ensures alerts are seen without interrupting workflow.

### 17.1 Notification Channels
1. **Toast Stack (Sonner Architecture):**
   - Position: Bottom-right (`bottom-6 right-6`).
   - Max visible toasts: 3 (stacked with scaling perspective `scale(0.95), scale(0.9)`).
   - Auto-dismiss: `4000ms` for success/info, manual dismiss for errors.
   - Glassmorphic container with left status accent bar.
2. **Inline Banner Alert:**
   - Placed within form contexts or dashboard headers (e.g. "Stripe payouts paused: verify bank identity").
3. **Live Attendance Check-in HUD:**
   - Full-width top toast showing member photo, name, and access granted sound waveform upon NFC scan.

---

## 18. Motion Design Rules

Motion is purposeful, snappy, and weighted like precision athletic equipment.

### 18.1 Physics & Easing Curves
- **Standard Kinetic Ease:** `cubic-bezier(0.16, 1, 0.3, 1)` (Expo Out)
  - *Feel:* Fast start, long graceful deceleration.
- **Spring Elastic Ease:** `cubic-bezier(0.34, 1.56, 0.64, 1)`
  - *Feel:* Playful micro-bounce for badges, checkmarks, and toggles.
- **Subtle Exit Ease:** `cubic-bezier(0.7, 0, 0.84, 0)` (Power2 In)
  - *Feel:* Quick departure to clear UI for incoming data.

### 18.2 Duration Standard
- **Micro-interactions (Toggles, buttons, tooltips):** `150ms – 250ms`
- **Component Entrances (Cards, table rows, dropdowns):** `300ms – 450ms`
- **Layout Morphs & Page Transitions (Modals, route wipes):** `500ms – 700ms`
- **Data Counting (Metric interpolations):** `1000ms – 1400ms`

---

## 19. GSAP Animation Guidelines

Every complex animation is coordinated through GSAP timelines with strict React 18 cleanup compliance.

### 19.1 Animation Playbook
1. **Kinetic Text Reveal (`useTextReveal`):**
   - Text elements are split into characters/words.
   - Characters initialize at `y: 40, opacity: 0, filter: 'blur(8px)'`.
   - GSAP timeline staggers them at `0.02s` intervals with `ease: "power4.out"`.
2. **Magnetic Cursor Physics (`useMagneticEffect`):**
   - Computes offset `(mouse - center) * strength`.
   - Lerps button coordinates using `power3.out`. On mouse leave, snaps back via `elastic.out(1, 0.4)`.
3. **Card Stagger Sequence:**
   - Dashboard grids enter using `gsap.from(cards, { opacity: 0, y: 30, stagger: 0.06, duration: 0.5 })`.
4. **ScrollTrigger Velocity Parallax:**
   - Studio images and 3D workout previews move at differential speeds (`scrub: 1`).
5. **Memory Leak Prevention:**
   - Every timeline is encapsulated in `gsap.context()` with `ctx.revert()` bound to component unmount.

---

## 20. Responsive Standards: Mobile / Tablet / Desktop

GymOS operates across three distinct hardware modes: the **Owner's Desktop**, the **Coach's Tablet**, and the **Athlete's Mobile Phone**.

### 20.1 Touch & Hardware Ergonomics
- **Minimum Touch Target:** `44px x 44px` on mobile and tablet touch viewports.
- **Thumb Zone Design:** On viewports `< 768px`, primary actions (Class Booking, Check-in Barcode, Quick Log) are pinned to the bottom 25% of the display.
- **Keyboard Shortcut Mapping:** On viewports `> 1024px`, global shortcuts are active (`⌘K` = Search, `N` = New Member, `B` = New Booking, `Esc` = Close Sheet).

### 20.2 Adaptive Breakpoint Behavior
| UI Component | Desktop (>= 1024px) | Tablet (768px – 1023px) | Mobile (< 768px) |
|---|---|---|---|
| **Navigation** | Persistent Left Sidebar (256px) | Collapsible Rail (72px) | Fixed Bottom Nav Bar (64px) |
| **Data Tables** | 12-column full telemetry table | Horizontal scroll with frozen name col | Stacked card list view |
| **Modals** | Center Floating Dialog | Center Dialog or Sheet | Bottom Sheet (Swipe to dismiss) |
| **Class Timetable** | Week/Month Grid View | 3-Day Carousel View | Day-by-Day Accordion |
| **Workout Logger** | Split Screen (Library + Sets) | Split Screen | Step-by-Step Live Set HUD |
