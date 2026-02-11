import { httpClient } from "@/shared/api/core/httpClient";
import type {
  IntegrationConfig,
  IntegrationStatus,
  IntegrationSyncResult,
  IntegrationSystemType,
  IntegrationCredentials,
  IntegrationSettings,
  HyeumPayrollSummary,
  HyeumDeadline,
  BizplayCard,
  BizplayExpense,
  BizplayExpenseSummary,
  BizplayCategoryBreakdown,
} from "../types";

// Response type converters
const toIntegrationConfig = (data: Record<string, unknown>): IntegrationConfig => ({
  id: data.id as number,
  companyId: data.company_id as number,
  systemType: data.system_type as IntegrationSystemType,
  isActive: data.is_active as boolean,
  lastSyncAt: data.last_sync_at as string | null,
  lastSyncStatus: data.last_sync_status as IntegrationConfig["lastSyncStatus"],
  lastSyncMessage: data.last_sync_message as string | null,
  settings: (data.settings as Record<string, unknown>) || {},
  createdAt: data.created_at as string,
  updatedAt: data.updated_at as string,
});

const toIntegrationStatus = (data: Record<string, unknown>): IntegrationStatus => ({
  systemType: data.system_type as IntegrationSystemType,
  isConnected: data.is_connected as boolean,
  isActive: data.is_active as boolean,
  lastSyncAt: data.last_sync_at as string | null,
  lastSyncStatus: data.last_sync_status as IntegrationStatus["lastSyncStatus"],
});

const toSyncResult = (data: Record<string, unknown>): IntegrationSyncResult => ({
  status: data.status as IntegrationSyncResult["status"],
  syncedAt: data.synced_at as string,
  recordsSynced: data.records_synced as number,
  details: (data.details as Record<string, unknown>) || {},
  errors: (data.errors as string[]) || [],
  message: data.message as string | undefined,
});

export const integrationService = {
  /**
   * Get all integrations for the current company
   */
  getAll: async (): Promise<IntegrationConfig[]> => {
    const data = await httpClient.get<Record<string, unknown>[]>("/integrations");
    return data.map(toIntegrationConfig);
  },

  /**
   * Get status of all integrations
   */
  getAllStatus: async (): Promise<IntegrationStatus[]> => {
    const data = await httpClient.get<Record<string, unknown>[]>("/integrations/status");
    return data.map(toIntegrationStatus);
  },

  /**
   * Get integration config by system type
   */
  getByType: async (systemType: IntegrationSystemType): Promise<IntegrationConfig> => {
    const data = await httpClient.get<Record<string, unknown>>(`/integrations/${systemType}`);
    return toIntegrationConfig(data);
  },

  /**
   * Get integration status by system type
   */
  getStatus: async (systemType: IntegrationSystemType): Promise<IntegrationStatus> => {
    const data = await httpClient.get<Record<string, unknown>>(`/integrations/${systemType}/status`);
    return toIntegrationStatus(data);
  },

  /**
   * Create or update integration config
   */
  configure: async (
    systemType: IntegrationSystemType,
    credentials: IntegrationCredentials,
    settings?: IntegrationSettings
  ): Promise<IntegrationConfig> => {
    const data = await httpClient.post<Record<string, unknown>>(`/integrations/${systemType}`, {
      credentials,
      settings,
    });
    return toIntegrationConfig(data);
  },

  /**
   * Update integration config
   */
  update: async (
    systemType: IntegrationSystemType,
    updates: {
      credentials?: IntegrationCredentials;
      settings?: IntegrationSettings;
      isActive?: boolean;
    }
  ): Promise<IntegrationConfig> => {
    const data = await httpClient.patch<Record<string, unknown>>(`/integrations/${systemType}`, {
      credentials: updates.credentials,
      settings: updates.settings,
      is_active: updates.isActive,
    });
    return toIntegrationConfig(data);
  },

  /**
   * Delete integration config
   */
  delete: async (systemType: IntegrationSystemType): Promise<void> => {
    await httpClient.delete(`/integrations/${systemType}`);
  },

  /**
   * Test integration connection
   */
  testConnection: async (
    systemType: IntegrationSystemType
  ): Promise<{ success: boolean; message: string; companyName?: string }> => {
    return httpClient.post(`/integrations/${systemType}/test`);
  },

  /**
   * Trigger sync for integration
   */
  sync: async (systemType: IntegrationSystemType): Promise<IntegrationSyncResult> => {
    const data = await httpClient.post<Record<string, unknown>>(`/integrations/${systemType}/sync`);
    return toSyncResult(data);
  },

  // ========== Hyeum Specific ==========

  /**
   * Get Hyeum payroll summary
   */
  getHyeumPayroll: async (period: string): Promise<HyeumPayrollSummary> => {
    const data = await httpClient.get<{
      total_employees: number;
      total_salary: number;
      total_tax: number;
      period?: string;
    }>(`/integrations/hyeum/payroll/${period}`);
    return {
      totalEmployees: data.total_employees,
      totalSalary: data.total_salary,
      totalTax: data.total_tax,
      period: data.period || period,
    };
  },

  /**
   * Get Hyeum upcoming deadlines
   */
  getHyeumDeadlines: async (): Promise<HyeumDeadline[]> => {
    const data = await httpClient.get<Array<{ title: string; due_date: string }>>(
      "/integrations/hyeum/deadlines"
    );
    return data.map((item) => ({
      title: item.title,
      dueDate: item.due_date,
    }));
  },

  // ========== Bizplay Specific ==========

  /**
   * Get Bizplay corporate cards
   */
  getBizplayCards: async (): Promise<BizplayCard[]> => {
    const data = await httpClient.get<
      Array<{
        card_id: string;
        card_number: string;
        card_name: string;
        holder_name: string;
        monthly_limit: number;
        used_amount: number;
        available_amount: number;
      }>
    >("/integrations/bizplay/cards");
    return data.map((card) => ({
      cardId: card.card_id,
      cardNumber: card.card_number,
      cardName: card.card_name,
      holderName: card.holder_name,
      monthlyLimit: card.monthly_limit,
      usedAmount: card.used_amount,
      availableAmount: card.available_amount,
    }));
  },

  /**
   * Get Bizplay expenses
   */
  getBizplayExpenses: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    cardId?: string;
  }): Promise<BizplayExpense[]> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.set("start_date", params.startDate);
    if (params?.endDate) queryParams.set("end_date", params.endDate);
    if (params?.status) queryParams.set("status", params.status);
    if (params?.cardId) queryParams.set("card_id", params.cardId);

    const query = queryParams.toString();
    const data = await httpClient.get<
      Array<{
        expense_id: string;
        card_number: string;
        merchant: string;
        amount: number;
        category: string;
        transaction_date: string;
        status: string;
        receipt_url: string | null;
      }>
    >(`/integrations/bizplay/expenses${query ? `?${query}` : ""}`);

    return data.map((expense) => ({
      expenseId: expense.expense_id,
      cardNumber: expense.card_number,
      merchant: expense.merchant,
      amount: expense.amount,
      category: expense.category,
      transactionDate: expense.transaction_date,
      status: expense.status as BizplayExpense["status"],
      receiptUrl: expense.receipt_url,
    }));
  },

  /**
   * Get Bizplay expense summary
   */
  getBizplayExpenseSummary: async (period: string): Promise<BizplayExpenseSummary> => {
    const data = await httpClient.get<{
      total_amount: number;
      approved_amount: number;
      pending_amount: number;
      transaction_count: number;
    }>(`/integrations/bizplay/expenses/summary/${period}`);

    return {
      totalAmount: data.total_amount,
      approvedAmount: data.approved_amount,
      pendingAmount: data.pending_amount,
      transactionCount: data.transaction_count,
    };
  },

  /**
   * Get Bizplay category breakdown
   */
  getBizplayCategoryBreakdown: async (period: string): Promise<BizplayCategoryBreakdown[]> => {
    const data = await httpClient.get<
      Array<{
        category: string;
        amount: number;
        percentage: number;
      }>
    >(`/integrations/bizplay/expenses/categories/${period}`);

    return data.map((item) => ({
      category: item.category,
      amount: item.amount,
      percentage: item.percentage,
    }));
  },
};
