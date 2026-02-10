import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  notificationService,
  type GetNotificationsParams,
} from "../api/notificationService";
import type { Notification } from "@/shared/types";

// Query keys
export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: (params?: GetNotificationsParams) =>
    [...NOTIFICATION_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...NOTIFICATION_QUERY_KEYS.all, "detail", id] as const,
  unreadCount: () => [...NOTIFICATION_QUERY_KEYS.all, "unread-count"] as const,
};

/**
 * Hook to fetch notifications
 */
export function useNotifications(params: GetNotificationsParams = {}) {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(params),
    queryFn: () => notificationService.getNotifications(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch unread notification count
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });

      // Snapshot previous values
      const previousNotifications = queryClient.getQueryData<Notification[]>(
        NOTIFICATION_QUERY_KEYS.list({})
      );
      const previousCount = queryClient.getQueryData<{ count: number }>(
        NOTIFICATION_QUERY_KEYS.unreadCount()
      );

      // Optimistically update notifications
      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          NOTIFICATION_QUERY_KEYS.list({}),
          previousNotifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          )
        );
      }

      // Optimistically update count
      if (previousCount) {
        queryClient.setQueryData<{ count: number }>(
          NOTIFICATION_QUERY_KEYS.unreadCount(),
          { count: Math.max(0, previousCount.count - 1) }
        );
      }

      return { previousNotifications, previousCount };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.list({}),
          context.previousNotifications
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.unreadCount(),
          context.previousCount
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });

      const previousNotifications = queryClient.getQueryData<Notification[]>(
        NOTIFICATION_QUERY_KEYS.list({})
      );

      // Optimistically mark all as read
      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          NOTIFICATION_QUERY_KEYS.list({}),
          previousNotifications.map((n) => ({ ...n, isRead: true }))
        );
      }

      // Reset unread count
      queryClient.setQueryData<{ count: number }>(
        NOTIFICATION_QUERY_KEYS.unreadCount(),
        { count: 0 }
      );

      return { previousNotifications };
    },
    onError: (err, vars, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.list({}),
          context.previousNotifications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });

      const previousNotifications = queryClient.getQueryData<Notification[]>(
        NOTIFICATION_QUERY_KEYS.list({})
      );

      // Optimistically remove the notification
      if (previousNotifications) {
        const notification = previousNotifications.find((n) => n.id === id);
        queryClient.setQueryData<Notification[]>(
          NOTIFICATION_QUERY_KEYS.list({}),
          previousNotifications.filter((n) => n.id !== id)
        );

        // Update unread count if the deleted notification was unread
        if (notification && !notification.isRead) {
          const previousCount = queryClient.getQueryData<{ count: number }>(
            NOTIFICATION_QUERY_KEYS.unreadCount()
          );
          if (previousCount) {
            queryClient.setQueryData<{ count: number }>(
              NOTIFICATION_QUERY_KEYS.unreadCount(),
              { count: Math.max(0, previousCount.count - 1) }
            );
          }
        }
      }

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.list({}),
          context.previousNotifications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });
    },
  });
}
