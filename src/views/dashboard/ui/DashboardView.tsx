"use client";

import { useEffect } from "react";
import {
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useHeader } from "@/shared/context/HeaderContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";

// Mock data - 실제로는 API에서 가져옴
const mockSummary = {
  todayDeadlines: 3,
  upcomingDeadlines: 8,
  overdueDeadlines: 1,
  pendingDocuments: 5,
  completionRate: 78,
  score: 85,
};

const mockUpcomingDeadlines = [
  {
    id: "1",
    title: "원천세 신고",
    dueDate: "2026-02-10",
    daysLeft: 0,
    type: "tax",
    priority: "high",
  },
  {
    id: "2",
    title: "4대보험 신고",
    dueDate: "2026-02-15",
    daysLeft: 5,
    type: "payroll",
    priority: "high",
  },
  {
    id: "3",
    title: "부가세 신고",
    dueDate: "2026-02-25",
    daysLeft: 15,
    type: "tax",
    priority: "medium",
  },
  {
    id: "4",
    title: "법인카드 정산",
    dueDate: "2026-02-28",
    daysLeft: 18,
    type: "admin",
    priority: "low",
  },
];

const typeLabels: Record<string, string> = {
  tax: "세무",
  payroll: "급여",
  admin: "행정",
  external: "외부",
};

const priorityColors: Record<string, "danger" | "warning" | "success"> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

export function DashboardView() {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "대시보드",
      subtitle: "오늘의 업무 현황을 확인하세요",
    });
  }, [setHeader]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">
              오늘 마감
            </CardTitle>
            <Calendar className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.todayDeadlines}</div>
            <p className="text-xs text-gray-5">
              {mockSummary.todayDeadlines > 0
                ? "오늘 처리해야 할 업무가 있습니다"
                : "오늘 마감 업무가 없습니다"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">
              지연 업무
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-status-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-danger">
              {mockSummary.overdueDeadlines}
            </div>
            <p className="text-xs text-gray-5">
              {mockSummary.overdueDeadlines > 0
                ? "즉시 처리가 필요합니다"
                : "지연된 업무가 없습니다"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">
              대기 증빙
            </CardTitle>
            <FileText className="h-4 w-4 text-status-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.pendingDocuments}</div>
            <p className="text-xs text-gray-5">검토 대기 중인 서류</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">
              업무 스코어
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-status-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.score}점</div>
            <Progress value={mockSummary.score} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>다가오는 마감</CardTitle>
                <CardDescription>
                  7일 내 마감 예정인 업무
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                전체보기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between rounded-lg border border-gray-3 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        deadline.daysLeft === 0
                          ? "bg-red-100"
                          : deadline.daysLeft <= 3
                            ? "bg-orange-100"
                            : "bg-blue-100"
                      }`}
                    >
                      <Clock
                        className={`h-5 w-5 ${
                          deadline.daysLeft === 0
                            ? "text-red-600"
                            : deadline.daysLeft <= 3
                              ? "text-orange-600"
                              : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-9">{deadline.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-5">
                        <span>{deadline.dueDate}</span>
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[deadline.type]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        deadline.daysLeft === 0
                          ? "danger"
                          : deadline.daysLeft <= 3
                            ? "warning"
                            : "info"
                      }
                    >
                      {deadline.daysLeft === 0
                        ? "D-Day"
                        : `D-${deadline.daysLeft}`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Status */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>이번 달 완료율</CardTitle>
                <CardDescription>
                  업무 처리 현황
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <svg className="h-36 w-36">
                  <circle
                    className="text-gray-3"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="72"
                    cy="72"
                  />
                  <circle
                    className="text-brand-primary"
                    strokeWidth="12"
                    strokeDasharray={`${mockSummary.completionRate * 3.51} 351`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="72"
                    cy="72"
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "center",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-9">
                    {mockSummary.completionRate}%
                  </span>
                  <span className="text-sm text-gray-5">완료율</span>
                </div>
              </div>
              <div className="mt-6 grid w-full grid-cols-3 gap-4 text-center">
                <div>
                  <CheckCircle className="mx-auto h-5 w-5 text-status-success" />
                  <p className="mt-1 text-2xl font-semibold">12</p>
                  <p className="text-xs text-gray-5">완료</p>
                </div>
                <div>
                  <Clock className="mx-auto h-5 w-5 text-status-warning" />
                  <p className="mt-1 text-2xl font-semibold">3</p>
                  <p className="text-xs text-gray-5">진행중</p>
                </div>
                <div>
                  <AlertTriangle className="mx-auto h-5 w-5 text-status-danger" />
                  <p className="mt-1 text-2xl font-semibold">1</p>
                  <p className="text-xs text-gray-5">지연</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
