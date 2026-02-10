"use client";

import React from "react";
import { Bell, Search, User } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/shared/components/ui/button";
import { useHeader } from "@/shared/context/HeaderContext";
import { useAppStore } from "@/shared/store/appStore";
import { Badge } from "@/shared/components/ui/badge";

export function GlobalHeader() {
  const { title, subtitle, actions } = useHeader();
  const { user, isLoaded } = useUser();
  const { toggleNotificationPanel } = useAppStore();

  // TODO: Replace with actual unread count from API
  const unreadCount = 3;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-3 bg-white px-6">
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-9">
            {title || "Backoffice Hub"}
          </h1>
          {subtitle && <p className="text-sm text-gray-5">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Custom Actions */}
        {actions}

        {/* Search */}
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-5 w-5 text-gray-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          onClick={toggleNotificationPanel}
        >
          <Bell className="h-5 w-5 text-gray-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        {isLoaded && user ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        ) : (
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <User className="h-5 w-5 text-gray-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
