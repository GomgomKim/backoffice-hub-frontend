/**
 * AI feature types
 */

// Document Classification
export interface DocumentCategory {
  id: string;
  name: string;
  subcategories: string[];
}

export interface DocumentClassifyRequest {
  content: string;
  filename?: string;
  deadlineType?: string;
  department?: string;
}

export interface DocumentClassifyResult {
  success: boolean;
  category: string;
  categoryName: string;
  subcategory: string;
  confidence: number;
  tags: string[];
  summary: string;
  keyInfo: {
    date?: string;
    amount?: string;
    parties?: string[];
  };
  error?: string;
}

export interface CategorySuggestion {
  category: string;
  categoryName: string;
  relevance: number;
  reason: string;
}

// Report Generation
export type ReportType = "monthly" | "deadline_summary" | "expense_analysis";

export interface ReportRequest {
  reportType: ReportType;
  period?: string;
  data?: Record<string, unknown>;
}

export interface ReportSection {
  title: string;
  content: string;
  metrics: Record<string, unknown>;
  highlights: string[];
}

export interface ReportResult {
  success: boolean;
  title: string;
  period: string;
  generatedAt: string;
  executiveSummary: string;
  sections: ReportSection[];
  kpiAnalysis: Record<string, unknown>;
  recommendations: string[];
  risks: string[];
  nextMonthOutlook: string;
  error?: string;
}

// Anomaly Detection
export type AnomalyType = "expense" | "deadline" | "pattern";

export interface AnomalyRequest {
  detectionType: AnomalyType;
  data: Record<string, unknown>[];
  historicalData?: Record<string, unknown>;
}

export interface AnomalyItem {
  expenseId?: string;
  deadlineId?: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  amount?: number;
  threshold?: number;
  recommendation: string;
}

export interface AnomalyResult {
  success: boolean;
  hasAnomalies: boolean;
  riskScore: number;
  anomalies: AnomalyItem[];
  summary: string;
  recommendations: string[];
  error?: string;
}

// AI Assistant
export interface AIAssistRequest {
  query: string;
  context?: Record<string, unknown>;
}

export interface AIAssistResult {
  success: boolean;
  response: string;
  suggestions: string[];
  relatedData: {
    relevantDeadlines?: unknown[];
    relevantDocuments?: unknown[];
    tips?: string[];
  };
  error?: string;
}

// AI Service Status
export interface AIStatus {
  isConfigured: boolean;
  useMock: boolean;
  capabilities: string[];
  model: string;
}
