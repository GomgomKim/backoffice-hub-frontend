/**
 * Integration types
 */

export type IntegrationSystemType =
  | "hyeum"
  | "bizplay"
  | "hometax"
  | "bank"
  | "slack";

export interface IntegrationConfig {
  id: number;
  companyId: number;
  systemType: IntegrationSystemType;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: "success" | "failed" | "partial" | null;
  lastSyncMessage: string | null;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationStatus {
  systemType: IntegrationSystemType;
  isConnected: boolean;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: "success" | "failed" | "partial" | null;
}

export interface IntegrationSyncResult {
  status: "success" | "failed" | "partial" | "skipped";
  syncedAt: string;
  recordsSynced: number;
  details: Record<string, unknown>;
  errors: string[];
  message?: string;
}

export interface IntegrationCredentials {
  apiKey?: string;
  companyId?: string;
  companyCode?: string;
  username?: string;
  password?: string;
  [key: string]: string | undefined;
}

export interface IntegrationSettings {
  useMockData?: boolean;
  syncInterval?: number;
  [key: string]: unknown;
}

// Hyeum specific types
export interface HyeumPayrollSummary {
  totalEmployees: number;
  totalSalary: number;
  totalTax: number;
  period: string;
}

export interface HyeumDeadline {
  title: string;
  dueDate: string;
}

// Bizplay specific types
export interface BizplayCard {
  cardId: string;
  cardNumber: string;
  cardName: string;
  holderName: string;
  monthlyLimit: number;
  usedAmount: number;
  availableAmount: number;
}

export interface BizplayExpense {
  expenseId: string;
  cardNumber: string;
  merchant: string;
  amount: number;
  category: string;
  transactionDate: string;
  status: "pending" | "approved" | "rejected";
  receiptUrl: string | null;
}

export interface BizplayExpenseSummary {
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  transactionCount: number;
}

export interface BizplayCategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

// Integration info for UI display
export interface IntegrationInfo {
  systemType: IntegrationSystemType;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export const INTEGRATION_INFO: Record<IntegrationSystemType, IntegrationInfo> =
  {
    hyeum: {
      systemType: "hyeum",
      name: "혜움",
      description: "급여, 4대보험, 인사관리 연동",
      icon: "Users",
      features: ["급여 데이터 동기화", "4대보험 정보", "HR 마감일 알림"],
    },
    bizplay: {
      systemType: "bizplay",
      name: "비즈플레이",
      description: "법인카드, 경비 관리 연동",
      icon: "CreditCard",
      features: ["법인카드 거래내역", "경비 정산 현황", "카테고리별 분석"],
    },
    hometax: {
      systemType: "hometax",
      name: "홈택스",
      description: "세금계산서, 세무 신고 연동",
      icon: "FileText",
      features: ["세금계산서 발행/수취", "부가세 신고", "원천세 신고"],
    },
    bank: {
      systemType: "bank",
      name: "은행 연동",
      description: "계좌 거래내역 조회",
      icon: "Building2",
      features: ["실시간 잔액 조회", "거래내역 동기화", "자금 현황 분석"],
    },
    slack: {
      systemType: "slack",
      name: "Slack",
      description: "알림 및 리마인더 연동",
      icon: "MessageSquare",
      features: ["마감일 알림", "업무 리마인더", "팀 공유"],
    },
  };
