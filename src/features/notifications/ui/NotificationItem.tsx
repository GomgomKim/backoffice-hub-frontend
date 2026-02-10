"use client";

import {
  Bell,
  Calendar,
  FileText,
  Settings,
  Link2,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Notification, NotificationType, NotificationPriority } from "@/shared/types";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
  deadline: <Calendar className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
  integration: <Link2 className="h-4 w-4" />,
};

const typeColors: Record<NotificationType, string> = {
  deadline: "bg-blue-100 text-blue-600",
  document: "bg-green-100 text-green-600",
  system: "bg-gray-100 text-gray-600",
  integration: "bg-purple-100 text-purple-600",
};

const priorityColors: Record<NotificationPriority, string> = {
  urgent: "border-l-red-500",
  high: "border-l-orange-500",
  normal: "border-l-blue-500",
  low: "border-l-gray-400",
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer gap-3 border-l-4 p-3 transition-colors hover:bg-gray-50",
        priorityColors[notification.priority],
        !notification.isRead && "bg-blue-50/50"
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
          typeColors[notification.type]
        )}
      >
        {typeIcons[notification.type]}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "line-clamp-1 text-sm",
              notification.isRead ? "text-gray-6" : "font-medium text-gray-9"
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        {notification.message && (
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-5">
            {notification.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-4">
          {formatTimeAgo(notification.createdAt)}
        </p>
      </div>

      {/* Actions (shown on hover) */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.isRead && onMarkAsRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleMarkAsRead}
            title="읽음 처리"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-4 hover:text-red-500"
            onClick={handleDelete}
            title="삭제"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
