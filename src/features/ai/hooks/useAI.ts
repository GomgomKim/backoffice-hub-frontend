import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "../api/aiService";
import type {
  DocumentClassifyRequest,
  ReportRequest,
  AnomalyRequest,
  AIAssistRequest,
} from "../types";

// Query Keys
export const AI_KEYS = {
  all: ["ai"] as const,
  status: () => [...AI_KEYS.all, "status"] as const,
  categories: () => [...AI_KEYS.all, "categories"] as const,
  reports: () => [...AI_KEYS.all, "reports"] as const,
  anomalies: () => [...AI_KEYS.all, "anomalies"] as const,
};

/**
 * Get AI service status
 */
export function useAIStatus() {
  return useQuery({
    queryKey: AI_KEYS.status(),
    queryFn: aiService.getStatus,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get document categories
 */
export function useDocumentCategories() {
  return useQuery({
    queryKey: AI_KEYS.categories(),
    queryFn: aiService.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

/**
 * Classify a document using AI
 */
export function useClassifyDocument() {
  return useMutation({
    mutationFn: (request: DocumentClassifyRequest) => aiService.classifyDocument(request),
  });
}

/**
 * Classify multiple documents in batch
 */
export function useClassifyDocumentsBatch() {
  return useMutation({
    mutationFn: (documents: DocumentClassifyRequest[]) =>
      aiService.classifyDocumentsBatch(documents),
  });
}

/**
 * Get category suggestions for a deadline
 */
export function useSuggestCategories() {
  return useMutation({
    mutationFn: ({
      deadlineType,
      deadlineTitle,
    }: {
      deadlineType: string;
      deadlineTitle: string;
    }) => aiService.suggestCategories(deadlineType, deadlineTitle),
  });
}

/**
 * Generate AI report
 */
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ReportRequest) => aiService.generateReport(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_KEYS.reports() });
    },
  });
}

/**
 * Detect anomalies
 */
export function useDetectAnomalies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AnomalyRequest) => aiService.detectAnomalies(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_KEYS.anomalies() });
    },
  });
}

/**
 * AI Assistant
 */
export function useAIAssist() {
  return useMutation({
    mutationFn: (request: AIAssistRequest) => aiService.assist(request),
  });
}
