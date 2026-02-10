"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Wallet,
  CreditCard,
  Receipt,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/shared/store/appStore";
import { Button } from "@/shared/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "마감 관리",
    href: "/deadlines",
    icon: Calendar,
  },
  {
    title: "증빙 관리",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "급여/4대보험",
    href: "/payroll",
    icon: Wallet,
  },
  {
    title: "지출/법인카드",
    href: "/expenses",
    icon: CreditCard,
  },
  {
    title: "세무신고",
    href: "/tax",
    icon: Receipt,
  },
  {
    title: "보고서",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "설정",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useAppStore();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-3 bg-white transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-3 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-brand-primary" />
          {!sidebarCollapsed && (
            <span className="text-lg font-bold text-gray-9">Backoffice</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebarCollapsed}
          className={cn("h-8 w-8", sidebarCollapsed && "hidden")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Collapse button when collapsed */}
      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebarCollapsed}
          className="mx-auto mt-2 h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-gray-6 hover:bg-gray-2 hover:text-gray-9",
                sidebarCollapsed && "justify-center px-2"
              )}
              title={sidebarCollapsed ? item.title : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-brand-primary" : "text-gray-5"
                )}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs text-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="border-t border-gray-3 p-4">
          <p className="text-xs text-gray-5">
            Backoffice Hub v0.1.0
          </p>
        </div>
      )}
    </aside>
  );
}
