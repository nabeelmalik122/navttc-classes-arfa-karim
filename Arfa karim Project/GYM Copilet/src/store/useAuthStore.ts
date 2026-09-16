import { create } from 'zustand';
import type { UserProfile, UserRole } from '@/core/types/user';
import type { AsyncStatus } from '@/core/types/common';

interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  status: AsyncStatus;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole | null) => void;
  setStatus: (status: AsyncStatus) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  status: 'idle',
  error: null,

  setUser: (user) => set({ user, role: user?.role ?? null }),
  setRole: (role) => set({ role }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, role: null, status: 'idle', error: null }),
}));
