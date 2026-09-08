import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserRole } from '@/types';
import { MOCK_USERS } from '@/services/mockData';
import { isFirebaseConfigured } from '@/services/firebase/firebase.config';
import { AuthService } from '@/services/firebase/auth.service';
import { FirestoreService } from '@/services/firebase/firestore.service';

const isProductionAuth = isFirebaseConfigured && import.meta.env.VITE_ENABLE_DEMO_AUTH !== "true";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: UserRole;
  isDemoMode: boolean;

  // Production Auth Methods
  initAuthListener: () => (() => void);
  login: (email: string, password?: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password?: string, name?: string, role?: UserRole, intendedPlanId?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;

  // Development/Sandbox Utility (Isolated)
  switchSandboxRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: isProductionAuth ? null : MOCK_USERS.member,
      isAuthenticated: !isProductionAuth,
      isLoading: isProductionAuth,
      activeRole: isProductionAuth ? 'guest' : 'member',
      isDemoMode: !isProductionAuth,

      initAuthListener: () => {
        if (!isProductionAuth) {
          set({ isLoading: false });
          return () => {};
        }

        set({ isLoading: true });

        const unsubscribe = AuthService.subscribeToAuthChanges(async (fbUser) => {
          if (fbUser) {
            try {
              let profile = await FirestoreService.getUserProfile(fbUser.uid);
              if (!profile) {
                profile = {
                  uid: fbUser.uid,
                  email: fbUser.email || "",
                  displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Athlete",
                  photoURL: fbUser.photoURL || undefined,
                  role: "member",
                  status: "active",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                await FirestoreService.createUserProfile(fbUser.uid, profile);
              }
              set({
                user: profile,
                activeRole: (profile.role as UserRole) || "member",
                isAuthenticated: true,
                isLoading: false,
                isDemoMode: false,
              });
            } catch (err) {
              console.error("[IRONX Auth] Error synchronizing user profile:", err);
              set({
                user: {
                  uid: fbUser.uid,
                  email: fbUser.email || "",
                  displayName: fbUser.displayName || "Athlete",
                  role: "member",
                  status: "active",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                activeRole: "member",
                isAuthenticated: true,
                isLoading: false,
                isDemoMode: false,
              });
            }
          } else {
            // Signed out in Firebase
            set({
              user: null,
              activeRole: "guest",
              isAuthenticated: false,
              isLoading: false,
              isDemoMode: false,
            });
          }
        });

        return unsubscribe;
      },

      login: async (email: string, password = "password123", role: UserRole = 'member') => {
        set({ isLoading: true });

        try {
          if (isFirebaseConfigured) {
            // Production Flow: Authenticate via Firebase Authentication
            const fbUser = await AuthService.login(email, password);
            if (fbUser) {
              // Retrieve role and profile from Firestore 'users' collection
              const profile = await FirestoreService.getUserProfile(fbUser.uid);
              if (profile) {
                set({
                  user: profile,
                  activeRole: (profile.role as UserRole) || "member",
                  isAuthenticated: true,
                  isLoading: false,
                  isDemoMode: false
                });
                return;
              }
            }
          }

          // Sandbox Fallback Flow (when Firebase credentials are not populated)
          await new Promise((resolve) => setTimeout(resolve, 500));
          const profile = MOCK_USERS[role] || {
            uid: `usr_${Date.now()}`,
            email,
            displayName: email.split('@')[0],
            role,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            activeRole: profile.role,
            isDemoMode: true
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          if (isFirebaseConfigured) {
            const fbUser = await AuthService.loginWithGoogle();
            if (fbUser) {
              let profile = await FirestoreService.getUserProfile(fbUser.uid);
              if (!profile) {
                // Initialize new member profile in Firestore
                profile = {
                  uid: fbUser.uid,
                  email: fbUser.email || "",
                  displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Athlete",
                  photoURL: fbUser.photoURL || undefined,
                  role: 'member',
                  status: 'active',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                await FirestoreService.createUserProfile(fbUser.uid, profile);
              }
              set({
                user: profile,
                activeRole: (profile.role as UserRole) || 'member',
                isAuthenticated: true,
                isLoading: false,
                isDemoMode: false
              });
              return;
            }
          }

          if (isProductionAuth) {
            throw new Error("LIVE_FIREBASE_NOT_CONFIGURED");
          }

          // Sandbox fallback (development only when isProductionAuth is false)
          await new Promise((resolve) => setTimeout(resolve, 500));
          const profile = MOCK_USERS.member;
          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            activeRole: 'member',
            isDemoMode: true
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password = "password123", name?: string, role: UserRole = 'member', intendedPlanId?: string) => {
        set({ isLoading: true });
        try {
          if (isFirebaseConfigured) {
            const fbUser = await AuthService.register(email, password);
            if (fbUser) {
              const newProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || email,
                displayName: name || email.split('@')[0],
                role,
                status: 'active',
                membershipId: intendedPlanId,
                accessPolicy: {
                  subscriptionRequired: true,
                  subscriptionStatus: 'none',
                  planId: (intendedPlanId as any) || null,
                  accessState: 'none',
                  effectiveUntil: null,
                  updatedAt: new Date().toISOString()
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              await FirestoreService.createUserProfile(fbUser.uid, newProfile);
              set({
                user: newProfile,
                activeRole: newProfile.role,
                isAuthenticated: true,
                isLoading: false,
                isDemoMode: false
              });
              return;
            }
          }

          // Sandbox fallback
          await new Promise((resolve) => setTimeout(resolve, 500));
          const profile: UserProfile = {
            uid: `usr_${Date.now()}`,
            email,
            displayName: name || email.split('@')[0],
            role,
            status: 'active',
            membershipId: intendedPlanId,
            accessPolicy: {
              subscriptionRequired: true,
              subscriptionStatus: 'none',
              planId: (intendedPlanId as any) || null,
              accessState: 'none',
              effectiveUntil: null,
              updatedAt: new Date().toISOString()
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            activeRole: profile.role,
            isDemoMode: true
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        if (isFirebaseConfigured) {
          await AuthService.logout();
        }
        set({
          user: null,
          isAuthenticated: false,
          activeRole: 'guest',
          isLoading: false
        });
      },

      switchSandboxRole: (role: UserRole) => {
        if (isProductionAuth) {
          console.warn("[IRONX Security] Sandbox role switching is disabled when live Firebase authentication is connected.");
          return;
        }

        const matchingProfile = MOCK_USERS[role];
        if (matchingProfile) {
          set({
            user: matchingProfile,
            activeRole: role,
            isAuthenticated: true,
            isDemoMode: true
          });
        } else if (role === 'guest') {
          set({
            user: null,
            activeRole: 'guest',
            isAuthenticated: false
          });
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedProfile = {
          ...currentUser,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        if (isFirebaseConfigured) {
          await FirestoreService.createUserProfile(currentUser.uid, updatedProfile);
        }

        set({ user: updatedProfile });
      },

      resetPassword: async (email: string) => {
        if (isFirebaseConfigured) {
          await AuthService.sendPasswordReset(email);
        }
      },

      confirmPasswordReset: async (oobCode: string, newPassword: string) => {
        if (isFirebaseConfigured) {
          await AuthService.confirmPasswordReset(oobCode, newPassword);
        }
      }
    }),
    {
      name: 'ironyx-auth-session',
      onRehydrateStorage: () => (state) => {
        if (isProductionAuth && state) {
          state.isLoading = true;
          // Purge mock development identities from localStorage in production mode
          if (state.user?.uid === MOCK_USERS.member.uid || state.isDemoMode) {
            state.user = null;
            state.isAuthenticated = false;
            state.activeRole = 'guest';
            state.isDemoMode = false;
          }
        }
      }
    }
  )
);
