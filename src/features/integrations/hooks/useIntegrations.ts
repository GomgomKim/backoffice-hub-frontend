import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationService } from "../api/integrationService";
import type {
  IntegrationSystemType,
  IntegrationCredentials,
  IntegrationSettings,
} from "../types";

// Query Keys
export const INTEGRATION_KEYS = {
  all: ["integrations"] as const,
  configs: () => [...INTEGRATION_KEYS.all, "configs"] as const,
  statuses: () => [...INTEGRATION_KEYS.all, "statuses"] as const,
  config: (type: IntegrationSystemType) => [...INTEGRATION_KEYS.configs(), type] as const,
  status: (type: IntegrationSystemType) => [...INTEGRATION_KEYS.statuses(), type] as const,
  // Hyeum
  hyeumPayroll: (period: string) => [...INTEGRATION_KEYS.all, "hyeum", "payroll", period] as const,
  hyeumDeadlines: () => [...INTEGRATION_KEYS.all, "hyeum", "deadlines"] as const,
  // Bizplay
  bizplayCards: () => [...INTEGRATION_KEYS.all, "bizplay", "cards"] as const,
  bizplayExpenses: (params?: Record<string, string>) =>
    [...INTEGRATION_KEYS.all, "bizplay", "expenses", params || {}] as const,
  bizplayExpenseSummary: (period: string) =>
    [...INTEGRATION_KEYS.all, "bizplay", "expenses", "summary", period] as const,
  bizplayCategoryBreakdown: (period: string) =>
    [...INTEGRATION_KEYS.all, "bizplay", "expenses", "categories", period] as const,
};

/**
 * Get all integration configs
 */
export function useIntegrationConfigs() {
  return useQuery({
    queryKey: INTEGRATION_KEYS.configs(),
    queryFn: integrationService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get all integration statuses
 */
export function useIntegrationStatuses() {
  return useQuery({
    queryKey: INTEGRATION_KEYS.statuses(),
    queryFn: integrationService.getAllStatus,
    staleTime: 60 * 1000, // 1 minute - status should be fresh
  });
}

/**
 * Get single integration config
 */
export function useIntegrationConfig(systemType: IntegrationSystemType) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.config(systemType),
    queryFn: () => integrationService.getByType(systemType),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get single integration status
 */
export function useIntegrationStatus(systemType: IntegrationSystemType) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.status(systemType),
    queryFn: () => integrationService.getStatus(systemType),
    staleTime: 60 * 1000,
  });
}

/**
 * Configure integration mutation
 */
export function useConfigureIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      systemType,
      credentials,
      settings,
    }: {
      systemType: IntegrationSystemType;
      credentials: IntegrationCredentials;
      settings?: IntegrationSettings;
    }) => integrationService.configure(systemType, credentials, settings),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.configs() });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.statuses() });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.config(variables.systemType) });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.status(variables.systemType) });
    },
  });
}

/**
 * Update integration mutation
 */
export function useUpdateIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      systemType,
      updates,
    }: {
      systemType: IntegrationSystemType;
      updates: {
        credentials?: IntegrationCredentials;
        settings?: IntegrationSettings;
        isActive?: boolean;
      };
    }) => integrationService.update(systemType, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.configs() });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.statuses() });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.config(variables.systemType) });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.status(variables.systemType) });
    },
  });
}

/**
 * Delete integration mutation
 */
export function useDeleteIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (systemType: IntegrationSystemType) => integrationService.delete(systemType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.configs() });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.statuses() });
    },
  });
}

/**
 * Test connection mutation
 */
export function useTestConnection() {
  return useMutation({
    mutationFn: (systemType: IntegrationSystemType) => integrationService.testConnection(systemType),
  });
}

/**
 * Sync integration mutation
 */
export function useSyncIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (systemType: IntegrationSystemType) => integrationService.sync(systemType),
    onSuccess: (_, systemType) => {
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.config(systemType) });
      queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.status(systemType) });
      // Invalidate specific data based on system type
      if (systemType === "hyeum") {
        queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.hyeumPayroll("") });
        queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.hyeumDeadlines() });
      } else if (systemType === "bizplay") {
        queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.bizplayCards() });
        queryClient.invalidateQueries({ queryKey: INTEGRATION_KEYS.bizplayExpenses() });
      }
    },
  });
}

// ========== Hyeum Hooks ==========

/**
 * Get Hyeum payroll data
 */
export function useHyeumPayroll(period: string, enabled = true) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.hyeumPayroll(period),
    queryFn: () => integrationService.getHyeumPayroll(period),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

/**
 * Get Hyeum upcoming deadlines
 */
export function useHyeumDeadlines(enabled = true) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.hyeumDeadlines(),
    queryFn: integrationService.getHyeumDeadlines,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ========== Bizplay Hooks ==========

/**
 * Get Bizplay cards
 */
export function useBizplayCards(enabled = true) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.bizplayCards(),
    queryFn: integrationService.getBizplayCards,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

/**
 * Get Bizplay expenses
 */
export function useBizplayExpenses(
  params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    cardId?: string;
  },
  enabled = true
) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.bizplayExpenses(params as Record<string, string>),
    queryFn: () => integrationService.getBizplayExpenses(params),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

/**
 * Get Bizplay expense summary
 */
export function useBizplayExpenseSummary(period: string, enabled = true) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.bizplayExpenseSummary(period),
    queryFn: () => integrationService.getBizplayExpenseSummary(period),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

/**
 * Get Bizplay category breakdown
 */
export function useBizplayCategoryBreakdown(period: string, enabled = true) {
  return useQuery({
    queryKey: INTEGRATION_KEYS.bizplayCategoryBreakdown(period),
    queryFn: () => integrationService.getBizplayCategoryBreakdown(period),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
