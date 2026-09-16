import { create } from 'zustand';
import type { TenantEnterprise, TenantLocation } from '@/core/types/tenant';
import type { AsyncStatus } from '@/core/types/common';

interface TenantState {
  currentTenant: TenantEnterprise | null;
  activeLocation: TenantLocation | null;
  locations: TenantLocation[];
  status: AsyncStatus;
  error: string | null;

  // Actions
  setCurrentTenant: (tenant: TenantEnterprise | null) => void;
  setActiveLocation: (location: TenantLocation | null) => void;
  setLocations: (locations: TenantLocation[]) => void;
  setStatus: (status: AsyncStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  currentTenant: null,
  activeLocation: null,
  locations: [],
  status: 'idle',
  error: null,

  setCurrentTenant: (currentTenant) => set({ currentTenant }),
  setActiveLocation: (activeLocation) => set({ activeLocation }),
  setLocations: (locations) => set({ locations }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ currentTenant: null, activeLocation: null, locations: [], status: 'idle', error: null }),
}));
