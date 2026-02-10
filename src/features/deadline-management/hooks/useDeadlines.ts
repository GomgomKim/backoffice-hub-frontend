/**
 * Deadline TanStack Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api";
import {
  deadlineService,
  type DeadlineFilters,
  type CreateDeadlinePayload,
  type UpdateDeadlinePayload,
  type CalendarParams,
} from "../api/deadlineService";

/**
 * Get all deadlines
 */
export function useDeadlines(companyId: string, filters?: DeadlineFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.DEADLINES(companyId, filters),
    queryFn: () => deadlineService.getDeadlines(filters),
    staleTime: 2 * 60 * 1000, // 2분
  });
}

/**
 * Get a single deadline
 */
export function useDeadline(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.DEADLINE(id),
    queryFn: () => deadlineService.getDeadline(id),
    enabled: !!id,
  });
}

/**
 * Get calendar deadlines
 */
export function useCalendarDeadlines(
  companyId: string,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: QUERY_KEYS.DEADLINE_CALENDAR(companyId, year, month),
    queryFn: () => deadlineService.getCalendarDeadlines({ year, month }),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * Get upcoming deadlines
 */
export function useUpcomingDeadlines(companyId: string, days: number = 7) {
  return useQuery({
    queryKey: QUERY_KEYS.UPCOMING_DEADLINES(companyId, days),
    queryFn: () => deadlineService.getUpcomingDeadlines(days),
    staleTime: 2 * 60 * 1000, // 2분
  });
}

/**
 * Get deadline types
 */
export function useDeadlineTypes() {
  return useQuery({
    queryKey: ["deadlineTypes"],
    queryFn: () => deadlineService.getDeadlineTypes(),
    staleTime: 30 * 60 * 1000, // 30분 (자주 바뀌지 않음)
  });
}

/**
 * Create deadline mutation
 */
export function useCreateDeadline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDeadlinePayload) =>
      deadlineService.createDeadline(payload),
    onSuccess: () => {
      // Invalidate all deadline queries
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["deadlineCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingDeadlines"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
}

/**
 * Update deadline mutation
 */
export function useUpdateDeadline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDeadlinePayload }) =>
      deadlineService.updateDeadline(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEADLINE(id) });
      queryClient.invalidateQueries({ queryKey: ["deadlineCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingDeadlines"] });
    },
  });
}

/**
 * Delete deadline mutation
 */
export function useDeleteDeadline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deadlineService.deleteDeadline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["deadlineCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingDeadlines"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
}

/**
 * Complete deadline mutation
 */
export function useCompleteDeadline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deadlineService.completeDeadline(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEADLINE(id) });
      queryClient.invalidateQueries({ queryKey: ["deadlineCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingDeadlines"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardScore"] });
    },
  });
}
