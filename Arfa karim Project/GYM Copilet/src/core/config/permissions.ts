import type { UserRole } from '../types/user';

export type PermissionAction = 
  | 'classes:manage'
  | 'classes:book'
  | 'members:view_all'
  | 'members:manage'
  | 'trainers:manage'
  | 'analytics:view'
  | 'workouts:create'
  | 'workouts:log';

export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  admin: [
    'classes:manage',
    'classes:book',
    'members:view_all',
    'members:manage',
    'trainers:manage',
    'analytics:view',
    'workouts:create',
    'workouts:log',
  ],
  trainer: [
    'classes:book',
    'members:view_all',
    'workouts:create',
    'workouts:log',
  ],
  member: [
    'classes:book',
    'workouts:log',
  ],
};

export function hasPermission(role: UserRole | undefined, permission: PermissionAction): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
