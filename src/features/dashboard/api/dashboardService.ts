import { httpClient } from "@/shared/api/core/httpClient";
import type { DashboardSummary, KPIData, Deadline } from "@/shared/types";

export interface ScoreBreakdown {
  totalScore: number;
  deadlineScore: number;
  documentScore: number;
  complianceScore: number;
  breakdown: {
    deadline: { score: number; max: number; details: string };
    document: { score: number; max: number; details: string };
    compliance: { score: number; max: number; details: string };
  };
}

export interface StatusCounts {
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
}

export const dashboardService = {
  /**
   * Get dashboard summary
   */
  getSummary: async (): Promise<DashboardSummary> => {
    const data = await httpClient.get<{
      today_deadlines: number;
      upcoming_deadlines: number;
      overdue_deadlines: number;
      pending_documents: number;
      completion_rate: number;
      score: number;
    }>("/dashboard/summary");

    return {
      todayDeadlines: data.today_deadlines,
      upcomingDeadlines: data.upcoming_deadlines,
      overdueDeadlines: data.overdue_deadlines,
      pendingDocuments: data.pending_documents,
      completionRate: data.completion_rate,
      score: data.score,
    };
  },

  /**
   * Get KPI data
   */
  getKPI: async (): Promise<KPIData[]> => {
    const data = await httpClient.get<
      Array<{
        label: string;
        value: number;
        change: number;
        trend: "up" | "down" | "neutral";
      }>
    >("/dashboard/kpi");

    return data.map((item) => ({
      label: item.label,
      value: item.value,
      change: item.change,
      trend: item.trend,
    }));
  },

  /**
   * Get score breakdown
   */
  getScore: async (): Promise<ScoreBreakdown> => {
    const data = await httpClient.get<{
      total_score: number;
      deadline_score: number;
      document_score: number;
      compliance_score: number;
      breakdown: {
        deadline: { score: number; max: number; details: string };
        document: { score: number; max: number; details: string };
        compliance: { score: number; max: number; details: string };
      };
    }>("/dashboard/score");

    return {
      totalScore: data.total_score,
      deadlineScore: data.deadline_score,
      documentScore: data.document_score,
      complianceScore: data.compliance_score,
      breakdown: data.breakdown,
    };
  },

  /**
   * Get upcoming deadlines
   */
  getUpcoming: async (days: number = 7): Promise<Deadline[]> => {
    const data = await httpClient.get<
      Array<{
        id: number;
        title: string;
        description?: string;
        due_date: string;
        status: string;
        priority: string;
        type?: string;
        assignee_id?: number;
        assignee?: { id: number; name: string };
        company_id: number;
        score: number;
        is_recurring: boolean;
        recurring_pattern?: string;
        created_at: string;
        updated_at: string;
      }>
    >(`/dashboard/upcoming?days=${days}`);

    return data.map((item) => ({
      id: String(item.id),
      title: item.title,
      description: item.description,
      dueDate: item.due_date,
      status: item.status as Deadline["status"],
      priority: item.priority as Deadline["priority"],
      type: (item.type || "admin") as Deadline["type"],
      assigneeId: item.assignee_id ? String(item.assignee_id) : undefined,
      assignee: item.assignee
        ? { ...item.assignee, id: String(item.assignee.id), email: "", role: "user" as const, companyId: "" }
        : undefined,
      companyId: String(item.company_id),
      score: item.score,
      isRecurring: item.is_recurring,
      recurringPattern: item.recurring_pattern,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  /**
   * Get status counts
   */
  getStatusCounts: async (): Promise<StatusCounts> => {
    const data = await httpClient.get<{
      completed: number;
      in_progress: number;
      pending: number;
      overdue: number;
    }>("/dashboard/status-counts");

    return {
      completed: data.completed,
      inProgress: data.in_progress,
      pending: data.pending,
      overdue: data.overdue,
    };
  },
};
