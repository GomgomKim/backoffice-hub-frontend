"use client";

import { useRouter } from "next/navigation";
import { X, Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useAppStore } from "@/shared/store/appStore";
import { cn } from "@/shared/lib/utils";
import { NotificationItem } from "./NotificationItem";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "../hooks/useNotifications";
import type { Notification } from "@/shared/types";

export function NotificationCenter() {
  const router = useRouter();
  const { notificationPanelOpen, setNotificationPanelOpen } = useAppStore();

  const { data: notifications = [], isLoading } = useNotifications({ limit: 50 });
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to related content if action URL exists
    if (notification.relatedType && notification.relatedId) {
      const routes: Record<string, string> = {
        deadline: `/deadlines/${notification.relatedId}`,
        document: `/documents/${notification.relatedId}`,
      };
      const route = routes[notification.relatedType];
      if (route) {
        router.push(route);
        setNotificationPanelOpen(false);
      }
    }
  };

  const handleClose = () => {
    setNotificationPanelOpen(false);
  };

  if (!notificationPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-96 transform bg-white shadow-xl transition-transform duration-300",
          notificationPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-6" />
            <h2 className="font-semibold text-gray-9">알림</h2>
            {unreadNotifications.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                {unreadNotifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="h-4 w-4" />
                모두 읽음
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-57px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-4" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-3" />
              <p className="mt-2 text-sm text-gray-5">알림이 없습니다</p>
            </div>
          ) : (
            <>
              {/* Unread Section */}
              {unreadNotifications.length > 0 && (
                <div>
                  <div className="bg-gray-1 px-4 py-2">
                    <p className="text-xs font-medium text-gray-5">읽지 않음</p>
                  </div>
                  <div className="divide-y divide-gray-2">
                    {unreadNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        onClick={handleNotificationClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Read Section */}
              {readNotifications.length > 0 && (
                <div>
                  <div className="bg-gray-1 px-4 py-2">
                    <p className="text-xs font-medium text-gray-5">이전 알림</p>
                  </div>
                  <div className="divide-y divide-gray-2">
                    {readNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDelete={handleDelete}
                        onClick={handleNotificationClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
