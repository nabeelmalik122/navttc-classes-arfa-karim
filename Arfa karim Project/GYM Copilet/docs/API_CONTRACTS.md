# API Contracts & Data Access Protocols

## 1. Firebase Service Contracts
All interactions with Firebase Cloud Services pass through strictly typed repository adapters. Direct Firestore calls in UI components are forbidden.

### Base Repository Interface
```typescript
export interface IRepository<T extends { id: string }> {
  getById(id: string): Promise<T | null>;
  getAll(constraints?: QueryConstraint[]): Promise<T[]>;
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  update(id: string, patch: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  subscribeOne(id: string, callback: (item: T | null) => void): () => void;
  subscribeMany(constraints: QueryConstraint[], callback: (items: T[]) => void): () => void;
}
```

## 2. Cloud Functions Contract Specifications

### `onMemberCreated`
- **Trigger**: Auth `onCreate`
- **Behavior**: Provisions corresponding `users/{uid}` record, attaches `member` role custom claim, logs audit event.

### `processClassBooking`
- **Type**: Callable Cloud Function (`httpsCallable`)
- **Payload**: `{ sessionId: string, memberId: string }`
- **Response**: `{ success: boolean, bookingId: string, status: 'confirmed' | 'waitlisted' }`
- **Validation**: Enforces atomic transaction on session capacity to prevent double booking.

### `createStripeSubscriptionCheckout`
- **Type**: Callable Cloud Function
- **Payload**: `{ planId: string, successUrl: string, cancelUrl: string }`
- **Response**: `{ checkoutUrl: string, sessionId: string }`

### `markSessionAttendance`
- **Type**: Callable Cloud Function
- **Payload**: `{ sessionId: string, bookingId: string, status: 'attended' | 'no_show' }`
- **Response**: `{ updated: boolean }`
