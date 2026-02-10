import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../api/dashboardService";

// Query keys
export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  summary: () => [...DASHBOARD_QUERY_KEYS.all, "summary"] as const,
  kpi: () => [...DASHBOARD_QUERY_KEYS.all, "kpi"] as const,
  score: () => [...DASHBOARD_QUERY_KEYS.all, "score"] as const,
  upcoming: (days?: number) => [...DASHBOARD_QUERY_KEYS.all, "upcoming", days] as const,
  statusCounts: () => [...DASHBOARD_QUERY_KEYS.all, "status-counts"] as const,
};

/**
 * Hook to fetch dashboard summary
 */
export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary(),
    queryFn: () => dashboardService.getSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch KPI data
 */
export function useDashboardKPI() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.kpi(),
    queryFn: () => dashboardService.getKPI(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch score breakdown
 */
export function useDashboardScore() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.score(),
    queryFn: () => dashboardService.getScore(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch upcoming deadlines
 */
export function useUpcomingDeadlines(days: number = 7) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.upcoming(days),
    queryFn: () => dashboardService.getUpcoming(days),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch status counts
 */
export function useStatusCounts() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.statusCounts(),
    queryFn: () => dashboardService.getStatusCounts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
