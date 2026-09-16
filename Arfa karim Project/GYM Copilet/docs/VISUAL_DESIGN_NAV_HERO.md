# Figma Visual Design Specification: Navbar & Hero Section
**Document Ref:** FIGMA-SPEC-GYMOS-01  
**Project:** GymOS Enterprise (Luxury Gym & Fitness Management SaaS)  
**Role:** Senior Lead Product Designer & Creative Technologist (Awwwards Jury Standards)  
**Aesthetic Theme:** High-Performance Athletic Luxury (Nike Lab × Gymshark Apex × Apple Spatial Restraint × Awwwards Site of the Year)  
**Color Direction:** Striking Black / Titanium White / Hyper Adrenaline Red (`#FF1E27`)

---

## 1. Color Palette Architecture (Black / White / Red Spectrum)

The palette embodies pure kinetic adrenaline tempered with surgical Apple-like restraint. It deliberately avoids neon green or multi-hue noise, committing exclusively to a bold triad: Deep Obsidian, Precision Titanium, and Hyper Athletic Red.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ THE ADRENALINE TRIAD                                                                   │
│                                                                                        │
│ [ VOID BLACK ]       [ OBSIDIAN PLATE ]   [ CARBON SURFACE ]   [ TITANIUM WHITE ]      │
│ #050507              #0B0B0E              #121217              #FFFFFF                 │
│ HSL(240, 17%, 2%)    HSL(240, 12%, 5%)    HSL(240, 12%, 8%)    Pure Specular Luminance │
│ (Base Canvas)        (Nav Scrolled Pill)  (Video / Metric Card)(Headlines & Highlights)│
│                                                                                        │
│ [ HYPER RED ACCENT ] [ DEEP BLOOD RED ]   [ VAPOR SILVER ]     [ GRAPHITE BORDER ]     │
│ #FF1E27              #8A0B10              #A1A1A6              #22222B                 │
│ HSL(358, 100%, 56%)  HSL(358, 85%, 29%)   HSL(240, 2%, 65%)    HSL(240, 12%, 15%)      │
│ (Primary CTAs/Glows) (Ambient Floor Halo) (Body / Labels)      (1px Structural Bounds) │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Exact Token Tokens
- `--bg-canvas`: `#050507` (99% black with cold blue undertone, prevents pure OLED crushing).
- `--surface-nav-initial`: `rgba(5, 5, 7, 0.40)` with `backdrop-filter: blur(8px)`.
- `--surface-nav-scrolled`: `rgba(11, 11, 14, 0.78)` with `backdrop-filter: blur(24px) saturate(180%)`.
- `--surface-card`: `#121217` (Deep carbon matte).
- `--text-white`: `#FFFFFF` (Headings, primary CTA text).
- `--text-titanium`: `#F5F5F7` (High-contrast body text).
- `--text-silver`: `#A1A1A6` (Secondary labels, metadata).
- `--text-muted`: `#63636E` (Captions, timestamps, disabled indicators).
- `--accent-red`: `#FF1E27` (Hyper Red — CTAs, active telemetry indicators, badge accents).
- `--accent-red-glow`: `rgba(255, 30, 39, 0.35)`.
- `--accent-red-subtle`: `rgba(255, 30, 39, 0.12)`.
- `--border-subtle`: `rgba(255, 255, 255, 0.08)`.
- `--border-card`: `#22222B`.
- `--border-red-focus`: `rgba(255, 30, 39, 0.50)`.

---

## 2. Layout Grid Systems

### 2.1 Desktop Grid (1440px Canvas & 1920px Ultrawide)
- **Container Max-Width:** `1320px` (centered).
- **Columns:** 12 Columns.
- **Column Width:** `82px` (fluid across 1440px).
- **Gutter:** `32px`.
- **Side Margins:** `60px` (min margin at 1440px; fluid `auto` on 1920px).
- **Baseline Vertical Grid:** `8px` geometric baseline rhythm.

### 2.2 Tablet Grid (768px – 1024px)
- **Container Width:** `100% - 64px` padding.
- **Columns:** 8 Columns.
- **Gutter:** `24px`.
- **Side Margins:** `32px`.

### 2.3 Mobile Grid (390px iPhone 15 Pro / 430px Max)
- **Container Width:** `100% - 32px` padding.
- **Columns:** 4 Columns.
- **Gutter:** `16px`.
- **Side Margins:** `16px` (outer edge gutter).

---

## 3. Section 01: Navbar Visual Blueprint

### 3.1 Desktop Wireframe & Pixel Specifications (1440px)

```
[Top Viewport: y=0 to y=88px] - Initial Unscrolled State
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ (Margin: 60px)                                                                                          (Margin: 60px) │
│ ┌──────────────┐         ┌──────────────────────────────────────────────────────────┐         ┌──────────────────────┐ │
│ │ [GYMOS] ●    │         │  Platform    Programs    Coaches    Pricing    Telemetry │         │ Sign In   [REQUEST ACCESS]│
│ └──────────────┘         └──────────────────────────────────────────────────────────┘         └──────────────────────┘ │
│ (H: 28px)                (Centered Navigation Cluster, H: 40px)                                (Cluster Width: 248px)  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

[Scrolled Pinned State: y > 80px] - Floating Command Capsule
                      ┌────────────────────────────────────────────────────────────────────────┐
                      │ [GYMOS] ● │  Platform  Programs  Coaches  Pricing  Telemetry │ [ACCESS] │
                      └────────────────────────────────────────────────────────────────────────┘
                      (Capsule: W: 960px, H: 54px, Radius: 9999px, Centered, Top: 16px, Border: 1px Solid White/8%)
```

#### Exact Component Coordinates & Specs (Desktop)
1. **Brand Cluster (Left):**
   - Position: Left aligned with grid margin `60px`.
   - Dimensions: Width `138px`, Height `28px`.
   - Logo Monogram: `GYMOS` in `Syne Display` (Bold, 20px, letter-spacing `-0.03em`, color `#FFFFFF`).
   - Radar Beacon Dot: `8px x 8px`, border-radius `50%`, background `#FF1E27`, positioned `8px` to the right of logo. Inset `box-shadow: 0 0 10px #FF1E27`.
   - Micro Status Tag: `ENTERPRISE` (Font: `JetBrains Mono`, 9px, uppercase, color `#A1A1A6`, tracking `+0.08em`).
2. **Navigation Cluster (Center):**
   - Position: Horizontally centered (`left: 50%`, `transform: translateX(-50%)`).
   - Dimensions: Height `40px`, Padding `0 16px`.
   - Nav Links (5 Items): `Platform`, `Programs`, `Coaches`, `Pricing`, `Telemetry`.
   - Typography: `Plus Jakarta Sans`, 14px, Medium (500 weight), color `#A1A1A6`.
   - Inter-item Spacing: `28px` horizontal gap.
   - Hover Indicator: Floating pill backdrop (`background: rgba(255, 255, 255, 0.06)`, `border-radius: 9999px`, height `32px`, vertical padding `6px`, horizontal padding `14px`). Text transitions to `#FFFFFF`.
3. **Action Cluster (Right):**
   - Position: Right aligned with grid margin `60px`.
   - Dimensions: Width `248px`, Height `44px`.
   - Secondary Link (`Sign In`):
     - Dimensions: Width `76px`, Height `40px`.
     - Typography: `Plus Jakarta Sans`, 14px, Medium, color `#A1A1A6`, hover color `#FFFFFF`.
   - Primary CTA Button (`Request Access`):
     - Dimensions: Width `152px`, Height `44px`.
     - Corner Radius: `10px`.
     - Background: Solid Hyper Red (`#FF1E27`).
     - Text: `REQUEST ACCESS` in `Plus Jakarta Sans`, 13px, Bold (700 weight), uppercase, color `#FFFFFF`, letter-spacing `+0.04em`.
     - Shadow: `0 0 20px rgba(255, 30, 39, 0.40)`.
     - Trailing Glyph: Right-pointing arrow icon (`12px x 12px`, stroke `2px`, color `#FFFFFF`).

---

### 3.2 Tablet Wireframe (768px – 1024px)
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [GYMOS] ●                                                          [ACCESS]  [≡ MENU]  │
└────────────────────────────────────────────────────────────────────────────────────────┘
(Height: 72px, Padding: 0 32px, Border-bottom: 1px solid rgba(255,255,255,0.06))
```
- Brand on left.
- Compact Primary CTA (`ACCESS`, Width `104px`, Height `38px`, 12px font) + Hamburger Icon (`40px x 40px` glass target, two 18px horizontal bars in Titanium White).
- Nav links collapse into slide-down glass drawer.

---

### 3.3 Mobile Wireframe (390px)
```
┌────────────────────────────────────────────────────────────────────────┐
│ [GYMOS] ●                                                     [≡ MENU] │
└────────────────────────────────────────────────────────────────────────┘
(Height: 64px, Padding: 0 16px, Backdrop: rgba(5,5,7,0.85), Blur: 20px)
```
- Left: Monogram + Red status dot.
- Right: Minimal tactile menu icon (`44px x 44px` touch hit area).
- Tap Behavior: Full-viewport overlay (`100dvh`, background `#050507`), staggered link entry (32px display font), full-width Hyper Red CTA at bottom (`height: 54px`, `radius: 12px`).

---

## 4. Section 02: Hero Section Visual Blueprint

### 4.1 Desktop Wireframe & Spatial Architecture (1440px × 900px Viewport)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [NAVBAR FLOATING ABOVE]                                                                                                │
│                                                                                                                        │
│ (Top Padding: 140px)                                                                                                   │
│ ┌──────────────────────────────────────────────┐        ┌────────────────────────────────────────────────────────────┐ │
│ │ [EYEBROW] █ ENTERPRISE ATHLETIC OS          │        │  3D CINEMATIC MEDIA PORTAL (60 FPS ATHLETIC HUD)          │ │
│ │                                              │        │  ┌──────────────────────────────────────────────────────┐  │ │
│ │ THE ARCHITECTURE                             │        │  │ [LIVE RECORDING: SQUAT LAB 04]        FPS: 60.00     │  │ │
│ │ OF PHYSICAL                                  │        │  │                                                      │  │ │
│ │ EXCELLENCE.                                  │        │  │     [ Ultra-High-Definition Dynamic Gym Action ]     │  │ │
│ │                                              │        │  │                                                      │  │ │
│ │ Subtitle: Engineered for elite facilities    │        │  │  BARBELL VELOCITY: 1.42 m/s    HEART RATE: 174 BPM   │  │ │
│ │ that demand zero-latency member telemetry,   │        │  │  RPE: 9.5                      ATTENDANCE: 94.8%     │  │ │
│ │ biometric access, and algorithmic billing.   │        │  └──────────────────────────────────────────────────────┘  │ │
│ │                                              │        │  (Width: 580px, Height: 440px, Radius: 24px)              │ │
│ │ ┌───────────────────┐  ┌───────────────────┐ │        │                                                            │ │
│ │ │ [REQUEST ACCESS]  │  │ [▷ WATCH TOUR]    │ │        │  FLOATING TELEMETRY HUD SATELLITE (Offset: x:-24px,y:380px)│ │
│ │ └───────────────────┘  └───────────────────┘ │        │  ┌──────────────────────────────────────────────────────┐  │ │
│ │ (H: 54px, Red Solid)   (H: 54px, Glass)      │        │  │ ● BIOMETRIC SCANNER: SYNCED (<12ms LATENCY)          │  │ │
│ └──────────────────────────────────────────────┘        │  └──────────────────────────────────────────────────────┘  │ │
│ (Cols 1 to 7: Width 660px)                              └────────────────────────────────────────────────────────────┘ │
│                                                         (Cols 8 to 12: Width 580px)                                    │
│ (Gap: 64px)                                                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ TELEMETRY TICKER BAR:  99.99% SYSTEM SLA  •  420+ GLOBAL CLUBS  •  1.8M+ CHECK-INS  •  $48M VOLUME PROCESSED  •  ●│ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│ (Bottom Bar: Height 56px, Border-top: 1px Solid White/8%, Width 1320px)                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Exact Content Placement & Coordinate Layout (Desktop 1440px)

#### Column Left (Content Engine): `x = 60px` to `x = 720px` (Width: 660px)
1. **Eyebrow Tag:**
   - Position: `top: 148px`, `left: 60px`.
   - Dimensions: Height `28px`, inline-flex.
   - Badge Container: Background `rgba(255, 30, 39, 0.12)`, border `1px solid rgba(255, 30, 39, 0.30)`, border-radius `9999px`, padding `4px 14px`.
   - Dot Indicator: `6px x 6px` square, background `#FF1E27`, margin-right `8px`.
   - Text: `ENTERPRISE ATHLETIC OS // RELEASE 2026.1`.
   - Typography: `JetBrains Mono`, 11px, Bold (700), uppercase, color `#FF1E27`, letter-spacing `+0.06em`.
2. **Main Headline:**
   - Position: `top: 196px`, `left: 60px`.
   - Width: `660px`.
   - Lines (Exact 3-Line Kinetic Stack):
     - Line 1: `THE ARCHITECTURE`
     - Line 2: `OF PHYSICAL`
     - Line 3: `EXCELLENCE.` (With period in Hyper Red `#FF1E27`).
   - Typography: `Syne Display`, 72px (Fluid clamp `clamp(2.75rem, 2.2rem + 3.8vw, 4.75rem)`), weight 800 (Extra Bold), line-height `0.98` (70.5px), letter-spacing `-0.04em`, color `#FFFFFF`.
   - Kinetic Stagger Hook: Each line is rendered inside an overflow-hidden wrapper with `data-reveal-line`.
3. **Subtitle / Paragraph:**
   - Position: `top: 432px`, `left: 60px`.
   - Width: `560px` (Constrained to 42 characters per line for optimal reading ergonomics).
   - Copy: *"Engineered for elite training facilities that demand sub-15ms biometric turnstile access, automated financial ledgers, and clinical athlete progression tracking."*
   - Typography: `Plus Jakarta Sans`, 18px (Fluid clamp `1.0rem – 1.125rem`), Regular (400), line-height `1.6` (28.8px), letter-spacing `-0.01em`, color `#A1A1A6`.
4. **Dual CTA Cluster:**
   - Position: `top: 532px`, `left: 60px`.
   - Width: `420px`, Height `54px`, horizontal gap `16px`.
   - **Primary Action (`Request Access`):**
     - Dimensions: Width `204px`, Height `54px`.
     - Corner Radius: `12px`.
     - Background: Linear gradient `135deg, #FF1E27 0%, #D40B13 100%`.
     - Inset Specular Highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.30)`.
     - Drop Shadow: `0 12px 28px -6px rgba(255, 30, 39, 0.45), 0 0 0 1px #FF1E27`.
     - Typography: `Plus Jakarta Sans`, 14px, Bold (700), uppercase, color `#FFFFFF`, letter-spacing `+0.04em`.
     - Icon: Minimalist angled arrow (`14px x 14px`), margin-left `10px`.
   - **Secondary Action (`Watch System Tour`):**
     - Dimensions: Width `196px`, Height `54px`.
     - Corner Radius: `12px`.
     - Background: `rgba(18, 18, 23, 0.70)` with `backdrop-filter: blur(16px)`.
     - Border: `1px solid rgba(255, 255, 255, 0.12)`.
     - Typography: `Plus Jakarta Sans`, 14px, Medium (500), color `#F5F5F7`.
     - Icon: Circular Play Glypher (`20px x 20px`, border `1px solid rgba(255,255,255,0.2)`, triangle glyph in Hyper Red `#FF1E27`).
5. **Trust Authority Strip:**
   - Position: `top: 618px`, `left: 60px`.
   - Height: `24px`.
   - Copy: `POWERING OLYMPIC CAMPS & 420+ LUXURY STUDIOS WORLDWIDE` in `JetBrains Mono`, 10px, uppercase, color `#63636E`, letter-spacing `+0.05em`.

---

#### Column Right (Visual Telemetry Portal): `x = 760px` to `x = 1380px` (Width: 620px)
1. **Cinematic Viewport Frame:**
   - Position: `top: 148px`, `left: 760px`.
   - Dimensions: Width `580px`, Height `460px`.
   - Corner Radius: `24px`.
   - Border: `1px solid rgba(255, 255, 255, 0.10)`.
   - Ambient Glow: Radial backdrop glow behind portal (`width: 500px, height: 400px, background: radial-gradient(circle, rgba(255, 30, 39, 0.18) 0%, transparent 70%)`, positioned centered behind card).
2. **Video Content Specs:**
   - Media Type: High-contrast, dynamic 4K athletic cinematography (60fps looped video, H.265/WebM, muted, playsinline).
   - Subject: High-energy weightlifting / sprint track / reformer biomechanics filmed in moody low-key cinematic lighting.
   - Tone Mapping: Deep shadows crushed, skin highlights crisp, red visual accents on barbell collars or digital displays.
   - Darkening Overlay: Vignette overlay `linear-gradient(180deg, rgba(5,5,7,0.3) 0%, transparent 40%, rgba(5,5,7,0.85) 100%)`.
3. **Embedded Video HUD Overlays:**
   - **Top Left HUD:** `REC ● LIVE FEED` in `JetBrains Mono`, 10px, color `#FF1E27`, blinking dot.
   - **Top Right HUD:** `LATENCY: 11.4 MS  •  FPS: 60.0` in `JetBrains Mono`, 10px, color `#A1A1A6`.
   - **Bottom Left Data Strip:**
     - Parameter 1: `BARBELL VELOCITY: 1.48 M/S`
     - Parameter 2: `PEAK POWER: 1,840 WATTS`
     - Typography: `JetBrains Mono`, 11px, Bold, color `#FFFFFF`.
   - **Bottom Right Metric Ring:**
     - Circular progress ring (`36px x 36px`, stroke `3px #FF1E27`, value `98% LOAD`).
4. **Satellite Telemetry Widget (Floating Glass Card):**
   - Position: `top: 480px`, `left: 710px` (Overlaps left edge of video frame by `50px`).
   - Dimensions: Width `270px`, Height `84px`.
   - Material: `rgba(11, 11, 14, 0.85)`, `backdrop-filter: blur(20px)`, border `1px solid rgba(255, 30, 39, 0.35)`, border-radius `16px`.
   - Inset Shadow: `0 16px 36px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 30, 39, 0.15)`.
   - Content:
     - Header: `ACCESS CONTROL GATE 02` (JetBrains Mono, 9px, color `#A1A1A6`).
     - Value: `NFC PASS VERIFIED` (Plus Jakarta Sans, 14px, Bold, color `#FFFFFF`).
     - Sub-metric: `LATENCY: 9.8ms • ATHLETE #4092` (JetBrains Mono, 10px, color `#FF1E27`).

---

#### Bottom Telemetry Bar (Full Grid Width): `x = 60px` to `x = 1380px`
- Position: `top: 730px`, `left: 60px`, Width `1320px`, Height `58px`.
- Border-Top: `1px solid rgba(255, 255, 255, 0.08)`.
- Layout: 4 evenly spaced horizontal telemetry items with vertical carbon dividers (`1px solid rgba(255,255,255,0.06)`, height `24px`).
- Metrics:
  1. `99.99%` — Hardware Uptime SLA
  2. `420+` — Elite Studios Operating
  3. `1.8M+` — Monthly Check-Ins
  4. `< 12ms` — Biometric Door Response
- Typography: Metric numbers in `JetBrains Mono` (16px, Bold, color `#FFFFFF`), Labels in `Plus Jakarta Sans` (12px, Regular, color `#A1A1A6`, margin-left `10px`).

---

### 4.3 Tablet Wireframe & Layout (768px – 1024px)
```
┌────────────────────────────────────────────────────────────────────────┐
│ [EYEBROW] █ ENTERPRISE ATHLETIC OS                                     │
│                                                                        │
│ THE ARCHITECTURE OF PHYSICAL EXCELLENCE.                               │
│ Subtitle: Engineered for elite facilities that demand zero-latency...  │
│                                                                        │
│ [REQUEST ACCESS]           [▷ WATCH TOUR]                              │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 3D CINEMATIC MEDIA PORTAL (W: 100%, H: 380px, Radius: 20px)        │ │
│ │ Embedded Telemetry: VELOCITY 1.48 M/S  •  HEART RATE 174 BPM       │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ TELEMETRY TICKER (Horizontal Scrollable Strip)                         │
└────────────────────────────────────────────────────────────────────────┘
```
- Content stacks in a single unified column (`padding: 100px 32px 40px`).
- Headline scales to `44px`.
- Video portal expands to full grid width (`100%`, height `380px`).
- Satellite telemetry card anchors to bottom-right of video portal.

---

### 4.4 Mobile Wireframe & Ergonomics (390px iPhone 15 Pro)
```
┌────────────────────────────────────────┐
│ [EYEBROW] █ ENTERPRISE OS              │
│                                        │
│ THE                                    │
│ ARCHITECTURE                           │
│ OF PHYSICAL                            │
│ EXCELLENCE.                            │
│                                        │
│ Subtitle text (15px, 3 lines max)      │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ [REQUEST ACCESS NOW] (H: 52px)     │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │ [▷ WATCH SYSTEM TOUR] (H: 48px)    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ VIDEO HUD PORTAL (H: 260px)        │ │
│ │ ● LIVE FEED                        │ │
│ └────────────────────────────────────┘ │
│                                        │
│ [ 99.99% SLA ] [ 420+ CLUBS ] (2x2)    │
└────────────────────────────────────────┘
```
- **Padding:** `84px 16px 32px`.
- **Headline:** `34px` in `Syne Display` (Tight line-height `1.05`).
- **Primary CTA:** Full width (`100%`, height `52px`, font `14px`), anchored within easy thumb range.
- **Video Portal:** Height `260px`, radius `16px`. Satellite card becomes an overlay chip in bottom corner.
- **Telemetry Bar:** 2x2 grid layout with `12px` gaps.

---

## 5. Micro-Interactions & Physics Specifications

### 5.1 Magnetic Button Interaction (Primary `Request Access` CTA)
- **Bounding Magnetic Zone:** Bounding box + `32px` padding on all 4 sides.
- **Physics Formula:**
  $$\Delta x = (x_{\text{mouse}} - x_{\text{center}}) \times 0.28$$
  $$\Delta y = (y_{\text{mouse}} - y_{\text{center}}) \times 0.28$$
- **GSAP Lerp:** `gsap.to(button, { x: deltaX, y: deltaY, duration: 0.4, ease: "power3.out" })`.
- **Mouse Exit Snap:** `gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" })`.

### 5.2 3D Gyroscope Viewport Tilt (Video Portal)
- **Interaction:** Mouse position within the right column tilts the video container in 3D perspective space (`perspective: 1200px`).
- **Max Rotation Angles:** `rotateX: ±5deg`, `rotateY: ±6deg`.
- **Specular Border Sweep:** Mouse coordinate drives a dynamic radial gradient highlight on the `1px` border:
  `border-image: radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), #FF1E27, rgba(255,255,255,0.08) 40%, transparent 80%)`.

---

## 6. GSAP Choreography Timeline (Page Load Sequence)

```
Time (s)   0.0s       0.2s       0.4s       0.6s       0.8s       1.0s       1.2s       1.4s
Navbar     [Fade In + Slide Down y: -20 -> 0]
Eyebrow               [Clip Reveal x: -20 -> 0, Opacity: 0 -> 1]
Headline L1                      [Split Text Reveal y: 60 -> 0, Blur: 8px -> 0]
Headline L2                                 [Split Text Reveal y: 60 -> 0, Blur: 8px -> 0]
Headline L3                                            [Split Text Reveal y: 60 -> 0, Blur: 8px -> 0]
Subtitle                                                          [Fade In y: 20 -> 0]
CTA Cluster                                                                  [Scale Spring: 0.95 -> 1]
Video Portal          [Clip-path Expand: polygon() + Scale: 1.05 -> 1.00]
Satellite Card                                                               [Slide In: x: 30 -> 0]
Telemetry Ticker                                                                        [Count-up]
```

### Detailed Timeline Code Specs
1. **T = 0.0s (Navbar):** `gsap.fromTo(navbar, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" })`.
2. **T = 0.2s (Eyebrow Tag):** `gsap.from(eyebrow, { x: -25, opacity: 0, duration: 0.6, ease: "power3.out" })`.
3. **T = 0.3s – 0.7s (Headline Lines):** `gsap.from(headlineLines, { y: 60, opacity: 0, filter: "blur(8px)", stagger: 0.12, duration: 0.9, ease: "expo.out" })`.
4. **T = 0.6s (Video Portal Entry):** `gsap.fromTo(videoPortal, { clipPath: "inset(15% 15% 15% 15% round 32px)", scale: 1.08, opacity: 0 }, { clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1.0, opacity: 1, duration: 1.2, ease: "expo.out" })`.
5. **T = 0.8s (CTAs & Satellite):** `gsap.from([ctaPrimary, ctaSecondary, satelliteWidget], { y: 24, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power3.out" })`.
6. **T = 1.0s (Telemetry Counter):** GSAP numeric tween interpolates numbers from 0 to target over `1.4s` with `ease: "power2.out"`.

---

## 7. Accessibility & Engineering Contracts

1. **Color Contrast Verification:**
   - White text (`#FFFFFF`) on Void Canvas (`#050507`): **19.8:1** (Passes WCAG AAA).
   - Hyper Red (`#FF1E27`) on Void Canvas (`#050507`): **4.8:1** (Passes WCAG AA for UI graphics and large text).
   - White text (`#FFFFFF`) on Hyper Red Button (`#FF1E27`): **4.6:1** (Passes WCAG AA).
2. **Focus Visibility:**
   - All interactive elements render a distinct `:focus-visible` ring: `2px solid #FF1E27` with `3px` offset in `#050507`.
3. **Reduced Motion Adaptation (`prefers-reduced-motion: reduce`):**
   - Disables 3D gyroscope video tilt and magnetic cursor mechanics.
   - Converts GSAP clip-path and blur text reveals into clean instant opacity transitions (`duration: 0.2s`).
   - Replaces video loop with high-resolution static frame (`hero-still.webp`).
4. **Semantic HTML Elements:**
   - Navbar: `<header>`, `<nav role="navigation">`, `<ul role="menubar">`.
   - Hero: `<section role="banner">`, `<h1>`, `<p>`, `<div role="group" aria-label="Action triggers">`.
