// API
export { notificationService } from "./api/notificationService";
export type { GetNotificationsParams, UnreadCountResponse } from "./api/notificationService";

// Hooks
export {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  NOTIFICATION_QUERY_KEYS,
} from "./hooks/useNotifications";

// UI
export { NotificationCenter } from "./ui/NotificationCenter";
export { NotificationItem } from "./ui/NotificationItem";
