import { create } from 'zustand';

export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // Duration in milliseconds. 0 or Infinity for persistent.
  createdAt: number;
  action?: NotificationAction;
  dismissible?: boolean;
}

export interface NotifyOptions {
  title?: string;
  message: string;
  duration?: number;
  action?: NotificationAction;
  dismissible?: boolean;
  id?: string;
}

export type NotifyInput = string | NotifyOptions;

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (item: Omit<NotificationItem, 'id' | 'createdAt'> & { id?: string }) => string;
  dismissNotification: (id: string) => void;
  updateNotification: (id: string, updates: Partial<Omit<NotificationItem, 'id'>>) => void;
  clearAll: () => void;
}

// Default duration per notification type in milliseconds
export const NOTIFICATION_DURATIONS: Record<NotificationType, number> = {
  success: 4000,
  info: 4500,
  warning: 6000,
  error: 8000,
  loading: 0, // Persistent until explicitly updated or dismissed
};

// Default titles per type
export const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  success: 'ACTION CONFIRMED',
  info: 'SYSTEM NOTICE',
  warning: 'CAUTION REQUIRED',
  error: 'ACTION FAILED',
  loading: 'PROCESSING REQUEST',
};

const DEDUPLICATION_WINDOW_MS = 2000;

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],

  addNotification: (input) => {
    const now = Date.now();
    const id = input.id || `vtx_notif_${now}_${Math.random().toString(36).slice(2, 7)}`;
    const current = get().notifications;

    // Deduplication check: prevent identical messages from spamming within 2 seconds
    const isDuplicate = current.some(
      (n) =>
        n.type === input.type &&
        n.message === input.message &&
        now - n.createdAt < DEDUPLICATION_WINDOW_MS
    );

    if (isDuplicate) {
      return id;
    }

    const newItem: NotificationItem = {
      id,
      type: input.type,
      title: input.title || NOTIFICATION_TITLES[input.type],
      message: input.message,
      duration: input.duration ?? NOTIFICATION_DURATIONS[input.type],
      createdAt: now,
      action: input.action,
      dismissible: input.dismissible ?? true,
    };

    // Keep max 5 active notifications on screen
    set((state) => ({
      notifications: [newItem, ...state.notifications.slice(0, 4)],
    }));

    return id;
  },

  dismissNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  updateNotification: (id: string, updates: Partial<Omit<NotificationItem, 'id'>>) => {
    set((state) => ({
      notifications: state.notifications.map((n) => {
        if (n.id === id) {
          const newType = updates.type || n.type;
          return {
            ...n,
            ...updates,
            title: updates.title || (updates.type ? NOTIFICATION_TITLES[newType] : n.title),
            duration: updates.duration !== undefined ? updates.duration : (updates.type ? NOTIFICATION_DURATIONS[newType] : n.duration),
          };
        }
        return n;
      }),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));

function parseInput(input: NotifyInput, defaultType: NotificationType): Omit<NotificationItem, 'id' | 'createdAt'> & { id?: string } {
  if (typeof input === 'string') {
    return {
      type: defaultType,
      title: NOTIFICATION_TITLES[defaultType],
      message: input,
      duration: NOTIFICATION_DURATIONS[defaultType],
      dismissible: true,
    };
  }

  return {
    id: input.id,
    type: defaultType,
    title: input.title || NOTIFICATION_TITLES[defaultType],
    message: input.message,
    duration: input.duration ?? NOTIFICATION_DURATIONS[defaultType],
    action: input.action,
    dismissible: input.dismissible ?? true,
  };
}

/**
 * Centralized VORTEX Notification Controller API
 */
export const notify = {
  success: (input: NotifyInput) => useNotificationStore.getState().addNotification(parseInput(input, 'success')),
  info: (input: NotifyInput) => useNotificationStore.getState().addNotification(parseInput(input, 'info')),
  warning: (input: NotifyInput) => useNotificationStore.getState().addNotification(parseInput(input, 'warning')),
  error: (input: NotifyInput) => useNotificationStore.getState().addNotification(parseInput(input, 'error')),
  loading: (input: NotifyInput) => useNotificationStore.getState().addNotification(parseInput(input, 'loading')),
  update: (id: string, updates: Partial<Omit<NotificationItem, 'id'>>) => useNotificationStore.getState().updateNotification(id, updates),
  dismiss: (id: string) => useNotificationStore.getState().dismissNotification(id),
  clear: () => useNotificationStore.getState().clearAll(),
};
