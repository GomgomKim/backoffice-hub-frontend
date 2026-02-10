// API Response Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "manager" | "user";
  companyId: string;
}

// Company Types
export interface Company {
  id: string;
  name: string;
  businessNumber: string;
  createdAt: string;
}

// Deadline Types
export type DeadlineStatus = "pending" | "in_progress" | "completed" | "overdue";
export type DeadlinePriority = "high" | "medium" | "low";
export type DeadlineType = "payroll" | "tax" | "admin" | "external";

export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: DeadlineStatus;
  priority: DeadlinePriority;
  type: DeadlineType;
  assigneeId?: string;
  assignee?: User;
  companyId: string;
  score: number;
  isRecurring: boolean;
  recurringPattern?: string;
  createdAt: string;
  updatedAt: string;
}

// Document Types
export type DocumentStatus = "pending" | "verified" | "rejected" | "expired";
export type DocumentCategory = "invoice" | "receipt" | "contract" | "certificate" | "report" | "other";

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  deadlineId?: string;
  companyId: string;
  uploadedById: string;
  uploadedBy?: User;
  verifiedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Checklist Types
export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  isRequired: boolean;
  documentId?: string;
}

export interface DocumentChecklist {
  id: string;
  deadlineId: string;
  items: ChecklistItem[];
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationPriority = "urgent" | "high" | "normal" | "low";
export type NotificationType = "deadline" | "document" | "system" | "integration";

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  relatedId?: string;
  relatedType?: string;
  createdAt: string;
}

// Dashboard Types
export interface DashboardSummary {
  todayDeadlines: number;
  upcomingDeadlines: number;
  overdueDeadlines: number;
  pendingDocuments: number;
  completionRate: number;
  score: number;
}

export interface KPIData {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "neutral";
}

// Integration Types
export type IntegrationType = "hyeum" | "bizplay" | "hometax" | "bank";

export interface IntegrationConfig {
  id: string;
  companyId: string;
  systemType: IntegrationType;
  isActive: boolean;
  credentials?: Record<string, string>;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}
