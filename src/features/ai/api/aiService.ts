import { httpClient } from "@/shared/api/core/httpClient";
import type {
  DocumentCategory,
  DocumentClassifyRequest,
  DocumentClassifyResult,
  CategorySuggestion,
  ReportRequest,
  ReportResult,
  AnomalyRequest,
  AnomalyResult,
  AIAssistRequest,
  AIAssistResult,
  AIStatus,
} from "../types";

export const aiService = {
  // ========== Document Classification ==========

  /**
   * Classify a document using AI
   */
  classifyDocument: async (request: DocumentClassifyRequest): Promise<DocumentClassifyResult> => {
    const data = await httpClient.post<{
      success: boolean;
      category: string;
      category_name: string;
      subcategory: string;
      confidence: number;
      tags: string[];
      summary: string;
      key_info: {
        date?: string;
        amount?: string;
        parties?: string[];
      };
      error?: string;
    }>("/ai/classify", {
      content: request.content,
      filename: request.filename,
      deadline_type: request.deadlineType,
      department: request.department,
    });

    return {
      success: data.success,
      category: data.category,
      categoryName: data.category_name,
      subcategory: data.subcategory,
      confidence: data.confidence,
      tags: data.tags || [],
      summary: data.summary,
      keyInfo: {
        date: data.key_info?.date,
        amount: data.key_info?.amount,
        parties: data.key_info?.parties,
      },
      error: data.error,
    };
  },

  /**
   * Classify multiple documents in batch
   */
  classifyDocumentsBatch: async (
    documents: DocumentClassifyRequest[]
  ): Promise<DocumentClassifyResult[]> => {
    const data = await httpClient.post<
      Array<{
        success: boolean;
        category: string;
        category_name: string;
        subcategory: string;
        confidence: number;
        tags: string[];
        summary: string;
        key_info: Record<string, unknown>;
        error?: string;
      }>
    >("/ai/classify/batch", {
      documents: documents.map((doc) => ({
        content: doc.content,
        filename: doc.filename,
        deadline_type: doc.deadlineType,
        department: doc.department,
      })),
    });

    return data.map((item) => ({
      success: item.success,
      category: item.category,
      categoryName: item.category_name,
      subcategory: item.subcategory,
      confidence: item.confidence,
      tags: item.tags || [],
      summary: item.summary,
      keyInfo: item.key_info as DocumentClassifyResult["keyInfo"],
      error: item.error,
    }));
  },

  /**
   * Get available document categories
   */
  getCategories: async (): Promise<DocumentCategory[]> => {
    const data = await httpClient.get<
      Array<{
        id: string;
        name: string;
        subcategories: string[];
      }>
    >("/ai/categories");

    return data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      subcategories: cat.subcategories,
    }));
  },

  /**
   * Get suggested categories for a deadline
   */
  suggestCategories: async (
    deadlineType: string,
    deadlineTitle: string
  ): Promise<CategorySuggestion[]> => {
    const data = await httpClient.post<
      Array<{
        category: string;
        category_name: string;
        relevance: number;
        reason: string;
      }>
    >("/ai/categories/suggest", {
      deadline_type: deadlineType,
      deadline_title: deadlineTitle,
    });

    return data.map((item) => ({
      category: item.category,
      categoryName: item.category_name,
      relevance: item.relevance,
      reason: item.reason,
    }));
  },

  // ========== Report Generation ==========

  /**
   * Generate AI-powered report
   */
  generateReport: async (request: ReportRequest): Promise<ReportResult> => {
    const data = await httpClient.post<{
      success: boolean;
      report?: {
        title: string;
        period: string;
        generated_at: string;
        executive_summary: string;
        sections: Array<{
          title: string;
          content: string;
          metrics: Record<string, unknown>;
          highlights: string[];
        }>;
        kpi_analysis: Record<string, unknown>;
        recommendations: string[];
        risks: string[];
        next_month_outlook: string;
      };
      // For deadline_summary and expense_analysis, fields are at root level
      summary?: string;
      priorities?: unknown[];
      recommendations?: string[];
      insights?: string[];
      error?: string;
    }>("/ai/report", {
      report_type: request.reportType,
      period: request.period,
      data: request.data,
    });

    // Handle different response formats based on report type
    if (data.report) {
      return {
        success: data.success,
        title: data.report.title,
        period: data.report.period,
        generatedAt: data.report.generated_at,
        executiveSummary: data.report.executive_summary,
        sections: data.report.sections.map((s) => ({
          title: s.title,
          content: s.content,
          metrics: s.metrics,
          highlights: s.highlights,
        })),
        kpiAnalysis: data.report.kpi_analysis,
        recommendations: data.report.recommendations,
        risks: data.report.risks,
        nextMonthOutlook: data.report.next_month_outlook,
        error: data.error,
      };
    }

    // Simplified response for other report types
    return {
      success: data.success,
      title: request.reportType === "deadline_summary" ? "마감 현황 요약" : "지출 분석",
      period: request.period || "",
      generatedAt: new Date().toISOString(),
      executiveSummary: data.summary || "",
      sections: [],
      kpiAnalysis: {},
      recommendations: data.recommendations || [],
      risks: [],
      nextMonthOutlook: "",
      error: data.error,
    };
  },

  // ========== Anomaly Detection ==========

  /**
   * Detect anomalies in data
   */
  detectAnomalies: async (request: AnomalyRequest): Promise<AnomalyResult> => {
    const data = await httpClient.post<{
      success: boolean;
      has_anomalies: boolean;
      risk_score: number;
      anomalies: Array<{
        expense_id?: string;
        deadline_id?: string;
        type: string;
        severity: string;
        description: string;
        amount?: number;
        threshold?: number;
        recommendation: string;
      }>;
      summary: string;
      recommendations: string[];
      error?: string;
    }>("/ai/anomaly", {
      detection_type: request.detectionType,
      data: request.data,
      historical_data: request.historicalData,
    });

    return {
      success: data.success,
      hasAnomalies: data.has_anomalies,
      riskScore: data.risk_score,
      anomalies: data.anomalies.map((a) => ({
        expenseId: a.expense_id,
        deadlineId: a.deadline_id,
        type: a.type,
        severity: a.severity as AnomalyResult["anomalies"][0]["severity"],
        description: a.description,
        amount: a.amount,
        threshold: a.threshold,
        recommendation: a.recommendation,
      })),
      summary: data.summary,
      recommendations: data.recommendations,
      error: data.error,
    };
  },

  // ========== AI Assistant ==========

  /**
   * Get AI assistance
   */
  assist: async (request: AIAssistRequest): Promise<AIAssistResult> => {
    const data = await httpClient.post<{
      success: boolean;
      response: string;
      suggestions: string[];
      related_data: {
        relevant_deadlines?: unknown[];
        relevant_documents?: unknown[];
        tips?: string[];
      };
      error?: string;
    }>("/ai/assist", {
      query: request.query,
      context: request.context,
    });

    return {
      success: data.success,
      response: data.response,
      suggestions: data.suggestions || [],
      relatedData: {
        relevantDeadlines: data.related_data?.relevant_deadlines,
        relevantDocuments: data.related_data?.relevant_documents,
        tips: data.related_data?.tips,
      },
      error: data.error,
    };
  },

  // ========== Status ==========

  /**
   * Get AI service status
   */
  getStatus: async (): Promise<AIStatus> => {
    const data = await httpClient.get<{
      is_configured: boolean;
      use_mock: boolean;
      capabilities: string[];
      model: string;
    }>("/ai/status");

    return {
      isConfigured: data.is_configured,
      useMock: data.use_mock,
      capabilities: data.capabilities,
      model: data.model,
    };
  },
};
