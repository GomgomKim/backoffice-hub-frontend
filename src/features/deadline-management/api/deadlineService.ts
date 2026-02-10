/**
 * Deadline API Service
 */
import { httpClient } from "@/shared/api";
import type {
  Deadline,
  DeadlineStatus,
  DeadlinePriority,
  DeadlineType,
} from "@/shared/types";

export interface DeadlineTypeResponse {
  id: number;
  name: string;
  category: string;
  description?: string;
  default_day?: number;
  is_recurring: boolean;
  recurring_pattern?: string;
}

export interface CreateDeadlinePayload {
  title: string;
  description?: string;
  due_date: string;
  priority?: DeadlinePriority;
  deadline_type_id?: number;
  assignee_id?: number;
  is_recurring?: boolean;
  recurring_pattern?: string;
}

export interface UpdateDeadlinePayload {
  title?: string;
  description?: string;
  due_date?: string;
  status?: DeadlineStatus;
  priority?: DeadlinePriority;
  assignee_id?: number;
}

export interface DeadlineFilters {
  status?: DeadlineStatus;
  priority?: DeadlinePriority;
  due_date_from?: string;
  due_date_to?: string;
}

export interface CalendarParams {
  year: number;
  month: number;
}

export const deadlineService = {
  /**
   * Get all deadlines
   */
  getDeadlines: async (filters?: DeadlineFilters): Promise<Deadline[]> => {
    return httpClient.get<Deadline[]>("/v1/deadlines", filters);
  },

  /**
   * Get a single deadline
   */
  getDeadline: async (id: string): Promise<Deadline> => {
    return httpClient.get<Deadline>(`/v1/deadlines/${id}`);
  },

  /**
   * Create a new deadline
   */
  createDeadline: async (payload: CreateDeadlinePayload): Promise<Deadline> => {
    return httpClient.post<Deadline>("/v1/deadlines", payload);
  },

  /**
   * Update a deadline
   */
  updateDeadline: async (
    id: string,
    payload: UpdateDeadlinePayload
  ): Promise<Deadline> => {
    return httpClient.put<Deadline>(`/v1/deadlines/${id}`, payload);
  },

  /**
   * Delete a deadline
   */
  deleteDeadline: async (id: string): Promise<void> => {
    return httpClient.delete(`/v1/deadlines/${id}`);
  },

  /**
   * Complete a deadline
   */
  completeDeadline: async (id: string): Promise<Deadline> => {
    return httpClient.patch<Deadline>(`/v1/deadlines/${id}/complete`);
  },

  /**
   * Get deadlines for calendar view
   */
  getCalendarDeadlines: async (params: CalendarParams): Promise<Deadline[]> => {
    return httpClient.get<Deadline[]>("/v1/deadlines/calendar", params);
  },

  /**
   * Get upcoming deadlines
   */
  getUpcomingDeadlines: async (days: number = 7): Promise<Deadline[]> => {
    return httpClient.get<Deadline[]>("/v1/deadlines/upcoming", { days });
  },

  /**
   * Get all deadline types
   */
  getDeadlineTypes: async (): Promise<DeadlineTypeResponse[]> => {
    return httpClient.get<DeadlineTypeResponse[]>("/v1/deadline-types");
  },
};
