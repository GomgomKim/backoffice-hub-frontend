"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Link2,
  Bell,
  Shield,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  CreditCard,
  FileText,
  Building,
  MessageSquare,
} from "lucide-react";
import { useHeader } from "@/shared/context/HeaderContext";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import {
  useIntegrationStatuses,
  useTestConnection,
  useSyncIntegration,
  INTEGRATION_INFO,
  type IntegrationSystemType,
} from "@/features/integrations";

type SettingsTab = "company" | "team" | "integrations" | "notifications" | "security";

const tabs = [
  { id: "company" as const, label: "회사 정보", icon: Building2 },
  { id: "team" as const, label: "팀 관리", icon: Users },
  { id: "integrations" as const, label: "외부 연동", icon: Link2 },
  { id: "notifications" as const, label: "알림 설정", icon: Bell },
  { id: "security" as const, label: "보안", icon: Shield },
];

const INTEGRATION_ICONS: Record<IntegrationSystemType, React.ComponentType<{ className?: string }>> = {
  hyeum: Users,
  bizplay: CreditCard,
  hometax: FileText,
  bank: Building,
  slack: MessageSquare,
};

export function SettingsView() {
  const { setHeader } = useHeader();
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const { data: statuses, isLoading: isLoadingStatuses, refetch: refetchStatuses } = useIntegrationStatuses();
  const testConnection = useTestConnection();
  const syncIntegration = useSyncIntegration();

  useEffect(() => {
    setHeader({
      title: "설정",
      subtitle: "시스템 설정을 관리하세요",
    });
  }, [setHeader]);

  const handleTestConnection = async (systemType: IntegrationSystemType) => {
    setTestingId(systemType);
    try {
      await testConnection.mutateAsync(systemType);
      await refetchStatuses();
    } finally {
      setTestingId(null);
    }
  };

  const handleSync = async (systemType: IntegrationSystemType) => {
    setSyncingId(systemType);
    try {
      await syncIntegration.mutateAsync(systemType);
      await refetchStatuses();
    } finally {
      setSyncingId(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "company":
        return (
          <Card>
            <CardHeader>
              <CardTitle>회사 정보</CardTitle>
              <CardDescription>회사 기본 정보를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-7">회사명</label>
                  <p className="mt-1 text-gray-9">(주) 테스트컴퍼니</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">사업자등록번호</label>
                  <p className="mt-1 text-gray-9">123-45-67890</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">대표자명</label>
                  <p className="mt-1 text-gray-9">홍길동</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">업종</label>
                  <p className="mt-1 text-gray-9">소프트웨어 개발</p>
                </div>
              </div>
              <Separator />
              <Button>정보 수정</Button>
            </CardContent>
          </Card>
        );

      case "integrations":
        return (
          <Card>
            <CardHeader>
              <CardTitle>외부 시스템 연동</CardTitle>
              <CardDescription>
                외부 SaaS 시스템과의 연동을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStatuses ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-5" />
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.values(INTEGRATION_INFO).map((info) => {
                    const status = statuses?.find((s) => s.systemType === info.systemType);
                    const Icon = INTEGRATION_ICONS[info.systemType];
                    const isSyncing = syncingId === info.systemType;
                    const isTesting = testingId === info.systemType;
                    const isConnected = status?.isConnected ?? false;
                    const isActive = status?.isActive ?? false;

                    return (
                      <div
                        key={info.systemType}
                        className="rounded-lg border border-gray-3 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-2">
                              <Icon className="h-6 w-6 text-gray-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-9">
                                  {info.name}
                                </p>
                                {isConnected && isActive && (
                                  <CheckCircle2 className="h-4 w-4 text-status-safe" />
                                )}
                                {isConnected && !isActive && (
                                  <XCircle className="h-4 w-4 text-status-warning" />
                                )}
                              </div>
                              <p className="text-sm text-gray-5">
                                {info.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={isConnected ? (isActive ? "success" : "warning") : "outline"}
                            >
                              {isConnected ? (isActive ? "연결됨" : "비활성") : "미연결"}
                            </Badge>
                            {isConnected && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSync(info.systemType)}
                                disabled={isSyncing || !isActive}
                              >
                                {isSyncing ? (
                                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="mr-1.5 h-4 w-4" />
                                )}
                                동기화
                              </Button>
                            )}
                            <Button
                              variant={isConnected ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleTestConnection(info.systemType)}
                              disabled={isTesting}
                            >
                              {isTesting ? (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                              ) : null}
                              {isConnected ? "설정" : "연결"}
                            </Button>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {info.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        {/* Last sync info */}
                        {status?.lastSyncAt && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-5">
                            <span>
                              마지막 동기화:{" "}
                              {new Date(status.lastSyncAt).toLocaleString("ko-KR")}
                            </span>
                            {status.lastSyncStatus && (
                              <Badge
                                variant={
                                  status.lastSyncStatus === "success"
                                    ? "success"
                                    : status.lastSyncStatus === "failed"
                                    ? "destructive"
                                    : "warning"
                                }
                                className="text-xs"
                              >
                                {status.lastSyncStatus === "success"
                                  ? "성공"
                                  : status.lastSyncStatus === "failed"
                                  ? "실패"
                                  : "부분 성공"}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>
                알림 수신 방법과 시점을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-9">마감 알림</p>
                    <p className="text-sm text-gray-5">
                      마감 D-7, D-3, D-1, D-Day에 알림
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    설정
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-9">이메일 알림</p>
                    <p className="text-sm text-gray-5">
                      중요 알림을 이메일로 수신
                    </p>
                  </div>
                  <Badge variant="success">활성화</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-9">Slack 알림</p>
                    <p className="text-sm text-gray-5">
                      Slack 채널로 알림 수신
                    </p>
                  </div>
                  <Badge variant="outline">비활성화</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-5">준비 중입니다.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-60 shrink-0">
        <Card>
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "text-gray-6 hover:bg-gray-2 hover:text-gray-9"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1">{renderTabContent()}</div>
    </div>
  );
}
