import { httpClient } from "@/shared/api/core/httpClient";
import type { Notification } from "@/shared/types";

export interface GetNotificationsParams {
  isRead?: boolean;
  type?: string;
  limit?: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationService = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (params: GetNotificationsParams = {}): Promise<Notification[]> => {
    const searchParams = new URLSearchParams();
    if (params.isRead !== undefined) {
      searchParams.set("is_read", String(params.isRead));
    }
    if (params.type) {
      searchParams.set("type", params.type);
    }
    if (params.limit) {
      searchParams.set("limit", String(params.limit));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/notifications?${queryString}` : "/notifications";

    return httpClient.get<Notification[]>(endpoint);
  },

  /**
   * Get a single notification by ID
   */
  getNotification: async (id: string): Promise<Notification> => {
    return httpClient.get<Notification>(`/notifications/${id}`);
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: string): Promise<Notification> => {
    return httpClient.patch<Notification>(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ message: string }> => {
    return httpClient.patch<{ message: string }>("/notifications/read-all");
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: string): Promise<void> => {
    return httpClient.delete(`/notifications/${id}`);
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return httpClient.get<UnreadCountResponse>("/notifications/unread/count");
  },
};
