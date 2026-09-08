import { notify, useNotificationStore, type NotifyInput, type NotifyOptions, type NotificationItem, type NotificationType } from "@/store/useNotificationStore";

export { notify, useNotificationStore };
export type { NotifyInput, NotifyOptions, NotificationItem, NotificationType };

// Aliased helper to also provide drop-in `toast` compatibility where appropriate
export const toast = notify;
