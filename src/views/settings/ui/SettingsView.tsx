"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Link2, Bell, Shield } from "lucide-react";
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

type SettingsTab = "company" | "team" | "integrations" | "notifications" | "security";

const tabs = [
  { id: "company" as const, label: "회사 정보", icon: Building2 },
  { id: "team" as const, label: "팀 관리", icon: Users },
  { id: "integrations" as const, label: "외부 연동", icon: Link2 },
  { id: "notifications" as const, label: "알림 설정", icon: Bell },
  { id: "security" as const, label: "보안", icon: Shield },
];

const integrations = [
  { id: "hyeum", name: "혜움", description: "급여/4대보험 관리", connected: true },
  { id: "bizplay", name: "비즈플레이", description: "법인카드/지출 관리", connected: false },
  { id: "hometax", name: "홈택스", description: "세무신고 연동", connected: true },
  { id: "bank", name: "은행 연동", description: "계좌/거래내역 조회", connected: false },
];

export function SettingsView() {
  const { setHeader } = useHeader();
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");

  useEffect(() => {
    setHeader({
      title: "설정",
      subtitle: "시스템 설정을 관리하세요",
    });
  }, [setHeader]);

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
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between rounded-lg border border-gray-3 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-2">
                        <Link2 className="h-6 w-6 text-gray-6" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-9">
                          {integration.name}
                        </p>
                        <p className="text-sm text-gray-5">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={integration.connected ? "success" : "outline"}
                      >
                        {integration.connected ? "연결됨" : "미연결"}
                      </Badge>
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        size="sm"
                      >
                        {integration.connected ? "설정" : "연결"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
