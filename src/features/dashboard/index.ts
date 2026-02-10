// API
export { dashboardService } from "./api/dashboardService";
export type { ScoreBreakdown, StatusCounts } from "./api/dashboardService";

// Hooks
export {
  useDashboardSummary,
  useDashboardKPI,
  useDashboardScore,
  useUpcomingDeadlines,
  useStatusCounts,
  DASHBOARD_QUERY_KEYS,
} from "./hooks/useDashboard";
