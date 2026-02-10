"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/shared/store/appStore";
import { Sidebar } from "@/shared/components/navigation/Sidebar";
import { GlobalHeader } from "@/shared/components/layout/GlobalHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);

  return (
    <div className="flex h-screen flex-col bg-gray-1">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div
          className={cn(
            "flex max-w-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
            {
              "ml-[240px]": !sidebarCollapsed,
              "ml-[64px]": sidebarCollapsed,
            }
          )}
        >
          <GlobalHeader />
          <main className="scrollbar-thin max-w-full flex-1 overflow-auto bg-gray-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
