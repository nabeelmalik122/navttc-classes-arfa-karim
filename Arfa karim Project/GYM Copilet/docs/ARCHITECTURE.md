# Enterprise Architecture Blueprint: Gym & Fitness Management SaaS

## 1. Architectural Style: Domain-Driven Feature Slices
The codebase is structured around business capabilities rather than technical roles. Each feature boundary maintains high internal cohesion and loose cross-feature coupling.

### Layer Diagram
```
┌────────────────────────────────────────────────────────┐
│               App Layer (src/app/)                     │
│  - Bootstrap, Route Composition, Layout Shells, Guards │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│             Feature Slices (src/features/)             │
│  - auth, members, classes, workouts, analytics, pos    │
│  - Domain components, hooks, services, types           │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│          Cross-Cutting Shared (src/shared/)            │
│  - Design Primitives (shadcn), Display HUDs, Utils     │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│       Core, State & Services (src/core, services)      │
│  - Firebase Repositories, Zustand Stores, RBAC Engine  │
└────────────────────────────────────────────────────────┘
```

## 2. Security & RBAC Model
Role-based access is evaluated at multiple tiers:
1. **Network / Cloud**: Firebase Custom Claims verified in Firestore Security Rules.
2. **Client Router**: Declarative `RoleGuard` validating user roles against permitted route lists.
3. **Component Visibility**: Conditional capability rendering via `hasPermission(user, 'classes:write')`.

### Defined Roles
- `super_admin`: Full tenant-wide authority, billing, cross-branch data, settings.
- `branch_manager`: Branch-level operations, staff scheduling, local inventory, member CRM.
- `trainer`: Client workout prescription, attendance marking, assigned schedule viewing.
- `member`: Personal workout logging, class booking, subscription self-service.

## 3. State Management Strategy
- **Zustand**: Manages local-first client UI state, active tenant context, authentication session, and active session transient state (e.g., booking wizard or live workout set counter).
- **Firebase Listeners**: Real-time subscriptions for high-concurrency entities (live class capacity, incoming notifications, member check-ins) managed through custom hooks.

## 4. Scalability Principles
- Code splitting with dynamic `React.lazy()` per dashboard section.
- Zero cyclic dependencies between features.
- Immutable data updates with TypeScript type narrowing and strict null checks.
