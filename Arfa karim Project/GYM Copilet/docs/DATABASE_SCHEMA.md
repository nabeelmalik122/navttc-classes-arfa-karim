# Database Schema & Data Dictionary

## 1. Top-Level Collections

### `users/{userId}`
Represents authenticated identity across the platform.
```typescript
interface UserDocument {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'super_admin' | 'branch_manager' | 'trainer' | 'member';
  tenantId: string;
  assignedLocationIds: string[];
  status: 'active' | 'suspended' | 'pending_invite';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `tenants/{tenantId}`
Multi-tenant enterprise root document.
```typescript
interface TenantDocument {
  id: string;
  companyName: string;
  slug: string;
  customDomain?: string;
  currency: string;
  timezone: string;
  branding: {
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
  };
  subscription: {
    stripeCustomerId: string;
    planTier: 'starter' | 'pro' | 'enterprise';
    status: 'trialing' | 'active' | 'past_due' | 'canceled';
    currentPeriodEnd: Timestamp;
  };
  features: {
    posEnabled: boolean;
    nutritionEnabled: boolean;
    turnstileIntegration: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 2. Subcollections Under `tenants/{tenantId}/`

### `locations/{locationId}`
Individual gym branch or studio facility.
- Fields: `name`, `address`, `capacity`, `operatingHours`, `amenities`, `managerId`.

### `classes/{classId}`
Class template definition.
- Fields: `title`, `description`, `category` (HIIT, Strength, Yoga, Spin), `durationMinutes`, `defaultCapacity`, `intensityLevel`, `imageUrl`.

### `sessions/{sessionId}`
Scheduled class instance occurring at a given date/time.
- Fields: `classId`, `locationId`, `trainerId`, `room`, `startTime`, `endTime`, `capacity`, `enrolledCount`, `waitlistCount`, `status` (`scheduled` | `in_progress` | `completed` | `cancelled`).

### `bookings/{bookingId}`
Member reservation for a class session.
- Fields: `sessionId`, `memberId`, `bookedAt`, `status` (`confirmed` | `waitlisted` | `checked_in` | `cancelled` | `no_show`), `checkInTime` (optional).

### `workout_plans/{planId}`
Curated multi-week workout program.
- Fields: `title`, `description`, `targetGoal`, `difficulty`, `weeksCount`, `creatorTrainerId`, `isTemplate`, `assignedMemberId` (optional).

### `workout_logs/{logId}`
Recorded workout performance session.
- Fields: `memberId`, `planId` (optional), `date`, `durationMinutes`, `exercises` array (exerciseId, sets: [{ setNumber, weightKg, reps, rpe, isWarmup }]), `notes`, `rating`.

### `inventory/{itemId}`
Pro-Shop merchandise and supplement stock.
- Fields: `sku`, `title`, `category`, `price`, `costPrice`, `stockQuantity`, `reorderThreshold`, `barcode`.
