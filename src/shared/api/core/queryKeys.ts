export const QUERY_KEYS = {
  // User
  USER: (userId: string) => ["user", userId] as const,
  CURRENT_USER: ["currentUser"] as const,

  // Company
  COMPANY: (companyId: string) => ["company", companyId] as const,

  // Deadlines
  DEADLINES: (companyId: string, params?: Record<string, unknown>) =>
    ["deadlines", companyId, params] as const,
  DEADLINE: (id: string) => ["deadline", id] as const,
  DEADLINE_CALENDAR: (companyId: string, year: number, month: number) =>
    ["deadlineCalendar", companyId, year, month] as const,
  UPCOMING_DEADLINES: (companyId: string, days?: number) =>
    ["upcomingDeadlines", companyId, days] as const,

  // Documents
  DOCUMENTS: (companyId: string, params?: Record<string, unknown>) =>
    ["documents", companyId, params] as const,
  DOCUMENT: (id: string) => ["document", id] as const,
  DOCUMENT_CHECKLIST: (deadlineId: string) =>
    ["documentChecklist", deadlineId] as const,

  // Notifications
  NOTIFICATIONS: (userId: string) => ["notifications", userId] as const,
  UNREAD_COUNT: (userId: string) => ["unreadCount", userId] as const,

  // Dashboard
  DASHBOARD_SUMMARY: (companyId: string) =>
    ["dashboardSummary", companyId] as const,
  DASHBOARD_KPI: (companyId: string) => ["dashboardKpi", companyId] as const,
  DASHBOARD_SCORE: (companyId: string) =>
    ["dashboardScore", companyId] as const,

  // Integrations
  INTEGRATION_CONFIGS: (companyId: string) =>
    ["integrationConfigs", companyId] as const,
  INTEGRATION_STATUS: (companyId: string, systemType: string) =>
    ["integrationStatus", companyId, systemType] as const,
} as const;
