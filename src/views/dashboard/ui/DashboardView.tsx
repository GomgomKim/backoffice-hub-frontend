"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Loader2,
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
import {
  useDashboardSummary,
  useUpcomingDeadlines,
  useStatusCounts,
} from "@/features/dashboard";

const typeLabels: Record<string, string> = {
  tax: "세무",
  payroll: "급여",
  admin: "행정",
  external: "외부",
};

function calculateDaysLeft(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function DashboardView() {
  const router = useRouter();
  const { setHeader } = useHeader();

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: upcomingDeadlines = [], isLoading: upcomingLoading } = useUpcomingDeadlines(7);
  const { data: statusCounts, isLoading: statusLoading } = useStatusCounts();

  useEffect(() => {
    setHeader({
      title: "대시보드",
      subtitle: "오늘의 업무 현황을 확인하세요",
    });
  }, [setHeader]);

  const isLoading = summaryLoading || upcomingLoading || statusLoading;

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
            {summaryLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-4" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.todayDeadlines ?? 0}</div>
                <p className="text-xs text-gray-5">
                  {(summary?.todayDeadlines ?? 0) > 0
                    ? "오늘 처리해야 할 업무가 있습니다"
                    : "오늘 마감 업무가 없습니다"}
                </p>
              </>
            )}
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
            {summaryLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-4" />
            ) : (
              <>
                <div className="text-2xl font-bold text-status-danger">
                  {summary?.overdueDeadlines ?? 0}
                </div>
                <p className="text-xs text-gray-5">
                  {(summary?.overdueDeadlines ?? 0) > 0
                    ? "즉시 처리가 필요합니다"
                    : "지연된 업무가 없습니다"}
                </p>
              </>
            )}
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
            {summaryLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-4" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.pendingDocuments ?? 0}</div>
                <p className="text-xs text-gray-5">검토 대기 중인 서류</p>
              </>
            )}
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
            {summaryLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-4" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.score ?? 0}점</div>
                <Progress value={summary?.score ?? 0} className="mt-2 h-2" />
              </>
            )}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/deadlines")}
              >
                전체보기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-4" />
              </div>
            ) : upcomingDeadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-gray-3" />
                <p className="mt-2 text-sm text-gray-5">
                  7일 내 마감 예정인 업무가 없습니다
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => {
                  const daysLeft = calculateDaysLeft(deadline.dueDate);
                  return (
                    <div
                      key={deadline.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-3 p-4 transition-colors hover:bg-gray-1"
                      onClick={() => router.push(`/deadlines?id=${deadline.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            daysLeft <= 0
                              ? "bg-red-100"
                              : daysLeft <= 3
                                ? "bg-orange-100"
                                : "bg-blue-100"
                          }`}
                        >
                          <Clock
                            className={`h-5 w-5 ${
                              daysLeft <= 0
                                ? "text-red-600"
                                : daysLeft <= 3
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
                              {typeLabels[deadline.type] || deadline.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            daysLeft <= 0
                              ? "danger"
                              : daysLeft <= 3
                                ? "warning"
                                : "info"
                          }
                        >
                          {daysLeft <= 0
                            ? daysLeft === 0
                              ? "D-Day"
                              : `D+${Math.abs(daysLeft)}`
                            : `D-${daysLeft}`}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
            {summaryLoading || statusLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-4" />
              </div>
            ) : (
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
                      strokeDasharray={`${(summary?.completionRate ?? 0) * 3.51} 351`}
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
                      {summary?.completionRate ?? 0}%
                    </span>
                    <span className="text-sm text-gray-5">완료율</span>
                  </div>
                </div>
                <div className="mt-6 grid w-full grid-cols-3 gap-4 text-center">
                  <div>
                    <CheckCircle className="mx-auto h-5 w-5 text-status-success" />
                    <p className="mt-1 text-2xl font-semibold">{statusCounts?.completed ?? 0}</p>
                    <p className="text-xs text-gray-5">완료</p>
                  </div>
                  <div>
                    <Clock className="mx-auto h-5 w-5 text-status-warning" />
                    <p className="mt-1 text-2xl font-semibold">
                      {(statusCounts?.inProgress ?? 0) + (statusCounts?.pending ?? 0)}
                    </p>
                    <p className="text-xs text-gray-5">진행중</p>
                  </div>
                  <div>
                    <AlertTriangle className="mx-auto h-5 w-5 text-status-danger" />
                    <p className="mt-1 text-2xl font-semibold">{statusCounts?.overdue ?? 0}</p>
                    <p className="text-xs text-gray-5">지연</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
