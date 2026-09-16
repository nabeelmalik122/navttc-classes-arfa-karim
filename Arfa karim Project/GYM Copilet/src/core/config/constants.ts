export const APP_ROUTES = {
  // Public Marketing
  HOME: '/',
  CLASSES: '/classes',
  TRAINERS: '/trainers',
  PRICING: '/pricing',
  CONTACT: '/contact',

  // Authentication
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Member Portal
  MEMBER_DASHBOARD: '/portal',
  MEMBER_CLASSES: '/portal/classes',
  MEMBER_BOOKINGS: '/portal/bookings',
  MEMBER_WORKOUTS: '/portal/workouts',
  MEMBER_PROFILE: '/portal/profile',

  // Trainer Portal
  TRAINER_DASHBOARD: '/trainer',
  TRAINER_SCHEDULE: '/trainer/schedule',
  TRAINER_CLIENTS: '/trainer/clients',
  TRAINER_WORKOUTS: '/trainer/workouts',

  // Admin Dashboard
  ADMIN_DASHBOARD: '/admin',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_TRAINERS: '/admin/trainers',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const;

export const THEME_COLORS = {
  VOID: '#050507',
  OBSIDIAN: '#0B0B0E',
  CARBON_CARD: '#121217',
  HYPER_RED: '#FF1E27',
  TITANIUM_WHITE: '#FFFFFF',
  SILVER: '#A1A1A6',
} as const;
