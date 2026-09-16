# GymOS Enterprise: Engineering Implementation Roadmap
**Role:** Senior Lead Frontend Engineer  
**Status:** Ready for Execution  
**Codebase Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Firebase 12 + Zustand 5 + GSAP 3.15 + Lenis

---

## 1. Priority Order of Development (Macro Milestones)

Execution proceeds across 6 disciplined phases, moving from shared atomic foundations to the public flagship homepage, authentication gates, and role-based operational dashboards.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: ATOMIC FOUNDATIONS & GSAP ENGINE CORE                                          │
│ - Design token verification in CSS, Shared UI primitives, GSAP hooks, Lenis setup       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: FLAGSHIP AWWWARDS HOMEPAGE                                                     │
│ - Navbar (Floating Morph), Hero (Kinetic + Video), Story, Programs, Plans, Final CTA   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: AUTHENTICATION & MULTI-TENANT ONBOARDING GATES                                 │
│ - OAuth / Email Auth, Custom Claims Hook, Role Guard Routing, Tenant Workspace Switcher │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: MEMBER & ATHLETE PORTAL                                                        │
│ - Daily Readiness HUD, Real-time Class Booking Engine, Live Workout Tracker, Pass NFC   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: TRAINER & COACH PORTAL                                                         │
│ - Client Roster, Routine Builder, PT Schedule Slots, Session Attendance Marking         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 6: ADMIN COMMAND CENTER & ENTERPRISE ENGINE                                       │
│ - Revenue Telemetry, Member CRM, Master Timetable, POS / Inventory, Stripe Invoicing    │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Exact Homepage Build Sequence

To maintain high visual momentum and immediate reviewability, the 13 homepage sections are engineered in 4 progressive sub-sprints:

### Sprint 2.1: The Anchor Experience (Above the Fold)
1. **Global Smooth Scroll Scaffold (`LenisProvider`):**
   - Bind Lenis virtual scroll to GSAP `ticker.add()` for 60fps synchronization.
2. **Navbar (`src/features/marketing/components/Navbar.tsx`):**
   - Floating glass pill, scroll shrink via `ScrollTrigger`, active magnetic CTA.
3. **Hero Section (`src/features/marketing/components/HeroSection.tsx`):**
   - 3-line kinetic typography split reveal, 60fps video portal, 3D mouse tilt, satellite HUD, live telemetry ticker.

### Sprint 2.2: The Athletic Core (Narrative & Disciplines)
4. **Brand Story (`src/features/marketing/components/BrandStory.tsx`):**
   - Pinned horizontal scroll scrubber with GSAP word-by-word illumination.
5. **Programs Showcase (`src/features/marketing/components/ProgramsShowcase.tsx`):**
   - Segmented category rail, GSAP Flip grid morphing, mouse spotlight cards.
6. **Trainers Showcase (`src/features/marketing/components/TrainersShowcase.tsx`):**
   - Typographic roster list with floating cursor-follow image trail (`quickTo`).

### Sprint 2.3: Proof & Commercial Conversion
7. **Transformation Results (`src/features/marketing/components/TransformationResults.tsx`):**
   - Interactive split Before/After slider with GSAP `Draggable`, SVG metric draw.
8. **Membership Plans (`src/features/marketing/components/MembershipPlans.tsx`):**
   - Monthly/Annual flip switch, GSAP numeric roll, tiered glass cards.
9. **Statistics & HUD (`src/features/marketing/components/StatisticsHUD.tsx`):**
   - Real-time telemetry counters with exponential deceleration.
10. **Testimonials Marquee (`src/features/marketing/components/TestimonialsMarquee.tsx`):**
    - Continuous horizontal ticker coupled to scroll velocity.

### Sprint 2.4: Conversion Closure & Foundation
11. **Gallery Experience (`src/features/marketing/components/GalleryExperience.tsx`):**
    - Multi-layer asymmetric parallax grid (`data-speed: 0.8` to `1.3`).
12. **FAQ Accordion (`src/features/marketing/components/FAQAccordion.tsx`):**
    - Pinned left category column, zero-layout-shift auto-height drawers.
13. **Contact & Final CTA (`src/features/marketing/components/ContactCTA.tsx`):**
    - Center stage card, orbiting dual neon aura, inline email capture.
14. **Footer (`src/features/marketing/components/Footer.tsx`):**
    - Parallax curtain reveal from under canvas, live cluster status.

---

## 3. Component Build Order (Atomic Hierarchy)

Components are built from lowest abstraction level upward to avoid circular dependencies and code duplication:

```
Level 1: Primitives (Atoms)
  └── Button, Input, Badge, Dialog, Dropdown, Skeleton, GlassCard

Level 2: Data Display & Feedback (Molecules)
  └── MetricWidget, SpotlightCard, StatusPill, KineticLoader, AccordionItem

Level 3: Feature Modules (Organisms)
  └── Navbar, HeroPortal, ClassSessionCard, WorkoutSetRow, BookingModal

Level 4: Structural Shells (Templates)
  └── MarketingLayout, AdminLayout, TrainerLayout, MemberLayout
```

---

## 4. Reusable Components Catalog to Implement

### Primitives (`src/shared/components/ui/`)
- `Button.tsx`: Variants (`primary`, `secondary`, `ghost`, `danger`, `icon`), sizes (`sm`, `md`, `lg`), magnetic wrapper support.
- `Input.tsx`: Variants (`default`, `search-hud`, `metric-affix`), focus glow, error message slot.
- `Badge.tsx`: Radar pulse dot, solid neon, outline, compact counters.
- `GlassCard.tsx`: Specular rim lighting, hover elevation, spotlight gradient support.
- `Dialog.tsx`: Spring enter/exit animation, blurred backdrop.
- `Sheet.tsx`: Side drawer (desktop) and bottom sheet (mobile) with drag-to-dismiss.
- `Tabs.tsx`: Animated sliding pill background indicator.

### Display & Feedback (`src/shared/components/display/ & feedback/`)
- `MetricCard.tsx`: Monospace numeric figure, percentage delta badge, sparkline slot.
- `SpotlightCard.tsx`: Cursor-following radial border highlight.
- `KineticLoader.tsx`: Dual-ring spinning neon loader with monospace status label.
- `EmptyState.tsx`: High-contrast icon, action button, structured prompt.
- `SkeletonLoader.tsx`: Shimmer sweep geometry matching card silhouettes.

---

## 5. GSAP Implementation Order

1. **Step 1: Core Lifecycle & Hooks (`src/animations/`)**
   - Register `ScrollTrigger`, `Flip`, `Observer` in `src/animations/gsap.ts`.
   - Implement `useGSAPContext` to ensure all React 18 mount/unmount lifecycles cleanly execute `ctx.revert()`.
2. **Step 2: Micro-Interaction Physics**
   - Implement `useMagneticEffect(elementRef, strength)` for primary CTA buttons.
   - Implement `useSpotlightEffect(cardRef)` for cursor-following border highlights.
   - Implement `useGyroTilt(containerRef)` for 3D card tilt.
3. **Step 3: Kinetic Text Engine**
   - Implement `useTextReveal(containerRef)` for character/word staggered typography.
4. **Step 4: Viewport Scroll Choreography**
   - Navbar morph (`ScrollTrigger` at `y > 80px`).
   - Horizontal word scrubber for Brand Story.
   - Parallax differential speeds for Gallery slabs.
   - Number counter interpolations for Statistics HUD.

---

## 6. Firebase Integration Order

1. **Firestore Client & Converters:**
   - Define typed data converters (`fromFirestore`, `toFirestore`) for all domain models.
2. **Base Generic Repository Testing:**
   - Verify `FirestoreRepository<T>` for single document fetches, queries, and optimistic updates.
3. **Real-Time Snapshot Listeners:**
   - Implement live subscriptions for class session capacities (`enrolledCount < capacity`) and member bookings.
4. **Cloud Functions Client Wrappers:**
   - Scaffold callable functions: `processBooking`, `createStripeCheckout`, `checkInWithNfc`.

---

## 7. Authentication Implementation Order

1. **Auth UI Slices (`src/features/auth/`):**
   - `LoginPage.tsx`: Email/Password input with validation + error banners.
   - `RegisterPage.tsx`: Tenant sign-up form with instant slug validation.
   - `ForgotPasswordPage.tsx`: Password recovery email trigger.
2. **Session & Custom Claims Bridge:**
   - Connect Firebase `onAuthStateChanged` to `useAuthStore`.
   - Decode `tokenResult.claims` (`role`, `tenantId`, `assignedLocations`).
3. **Routing Security Gates:**
   - Verify `<AuthGuard>` redirects unauthenticated users to `/login`.
   - Verify `<RoleGuard>` isolates `/admin`, `/trainer`, and `/portal`.
   - Verify `<TenantGuard>` prompts tenantless users to complete onboarding.

---

## 8. Member & Athlete Portal Development Order

1. **Portal Shell & Bottom Navigation (`MemberLayout.tsx`):**
   - Mobile-first thumb navigation (`Today`, `Classes`, `Bookings`, `Workout`, `Pass`).
2. **Daily Readiness & Streak Hub (`MemberPortalDashboardPage.tsx`):**
   - Check-in streak badge, today's booked classes, recommended routines.
3. **Live Class Discovery & Booking Sheet (`MemberClassesPage.tsx`):**
   - Interactive calendar bar, discipline filters, one-tap booking modal.
4. **Active Workout Logger (`MemberTrackerPage.tsx`):**
   - Live exercise set logger (weight, reps, RPE), rest stopwatch counter, volume calculator.
5. **Digital Pass & NFC Generator (`MemberMembershipPage.tsx`):**
   - Dynamic barcode / QR code display, subscription status, billing receipts.

---

## 9. Trainer & Coach Portal Development Order

1. **Shift Schedule & PT Booking Grid (`TrainerSchedulePage.tsx`):**
   - Day / Week view of assigned group classes and 1-on-1 PT client appointments.
2. **Client Roster & Assessments (`TrainerClientsPage.tsx`):**
   - Member search, injury records, 1RM milestones, attendance history.
3. **Program & Routine Builder (`TrainerProgramsPage.tsx`):**
   - Exercise search, set/rep periodization editor, client assignment workflow.
4. **Session Attendance Terminal:**
   - Quick check-in toggle (`Attended`, `No-Show`, `Late Cancel`).

---

## 10. Admin Command Center Development Order

1. **Real-time Telemetry Command Center (`AdminDashboardPage.tsx`):**
   - Top KPI metric cards (MRR, Total Athletes, Today's Check-Ins, Studio Occupancy).
   - Real-time check-in stream.
2. **Member CRM & Lifecycle Matrix (`AdminMembersPage.tsx`):**
   - Searchable, paginated data table with status badges (`Active`, `Overdue`, `Frozen`).
   - Member detail slide-over sheet.
3. **Master Timetable Scheduler (`AdminSchedulePage.tsx`):**
   - Multi-room calendar grid, trainer drag-and-drop assignment, capacity indicators.
4. **Pro-Shop POS Terminal (`AdminPOSPage.tsx`):**
   - Barcode scanning input, item grid, quick charge to member account.
5. **Financial Ledger & Stripe Invoicing (`AdminFinancePage.tsx`):**
   - P&L telemetry, subscription churn analytics, refund actions.
6. **Enterprise Settings & Hardware Access (`AdminSettingsPage.tsx`):**
   - Turnstile API tokens, brand colors, staff role delegation.

---

## Immediate Next Action

With the roadmap established, engineering begins on **Phase 1 & Sprint 2.1**:
- Create reusable design primitives (`Button`, `Badge`, `GlassCard`, `Input`).
- Configure Lenis smooth scroll bridge.
- Implement the **Navbar** (Floating Morph Pill) and **Hero Section** (Kinetic Typography, 60fps Video HUD, Telemetry Bar).
