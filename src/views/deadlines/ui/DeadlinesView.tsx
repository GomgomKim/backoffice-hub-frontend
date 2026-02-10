"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  List,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useHeader } from "@/shared/context/HeaderContext";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import {
  DeadlineFormModal,
  DeadlineDetailPanel,
  DDayBadge,
  DeadlineFilter,
  type DeadlineFilterValues,
} from "@/features/deadline-management";
import type { Deadline } from "@/shared/types";

type ViewMode = "calendar" | "list";

// Mock data - 실제로는 API에서 가져옴
const mockDeadlines: Deadline[] = [
  {
    id: "1",
    title: "원천세 신고",
    description: "원천징수세액 신고 및 납부",
    dueDate: "2026-02-10",
    status: "pending",
    type: "tax",
    priority: "high",
    companyId: "1",
    score: 0,
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "2",
    title: "4대보험 신고",
    description: "국민연금, 건강보험, 고용보험, 산재보험 신고",
    dueDate: "2026-02-15",
    status: "in_progress",
    type: "payroll",
    priority: "high",
    companyId: "1",
    score: 0,
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "3",
    title: "부가세 신고",
    description: "부가가치세 확정 신고",
    dueDate: "2026-02-25",
    status: "pending",
    type: "tax",
    priority: "medium",
    companyId: "1",
    score: 0,
    isRecurring: true,
    recurringPattern: "quarterly",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "4",
    title: "법인카드 정산",
    description: "월간 법인카드 사용 내역 정산",
    dueDate: "2026-02-28",
    status: "pending",
    type: "admin",
    priority: "low",
    companyId: "1",
    score: 0,
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "5",
    title: "급여 지급",
    description: "월 급여 지급",
    dueDate: "2026-02-25",
    status: "completed",
    type: "payroll",
    priority: "high",
    companyId: "1",
    score: 100,
    isRecurring: true,
    recurringPattern: "monthly",
    createdAt: "2026-01-01",
    updatedAt: "2026-02-05",
  },
];

const typeColors: Record<string, string> = {
  tax: "bg-purple-100 text-purple-800",
  payroll: "bg-blue-100 text-blue-800",
  admin: "bg-gray-100 text-gray-800",
  external: "bg-green-100 text-green-800",
};

const typeLabels: Record<string, string> = {
  tax: "세무",
  payroll: "급여",
  admin: "행정",
  external: "외부",
};

const statusLabels: Record<string, string> = {
  pending: "대기",
  in_progress: "진행중",
  completed: "완료",
  overdue: "지연",
};

const statusColors: Record<string, "default" | "warning" | "success" | "danger"> = {
  pending: "default",
  in_progress: "warning",
  completed: "success",
  overdue: "danger",
};

export function DeadlinesView() {
  const { setHeader } = useHeader();
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [filters, setFilters] = useState<DeadlineFilterValues>({});

  useEffect(() => {
    setHeader({
      title: "마감 관리",
      subtitle: "업무 마감 일정을 관리하세요",
      actions: (
        <Button className="gap-2" onClick={() => setIsFormModalOpen(true)}>
          <Plus className="h-4 w-4" />
          마감 추가
        </Button>
      ),
    });
  }, [setHeader]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDeadlinesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockDeadlines.filter((d) => d.dueDate === dateStr);
  };

  const handleDeadlineClick = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setIsDetailPanelOpen(true);
  };

  const handleEdit = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setIsDetailPanelOpen(false);
    setIsFormModalOpen(true);
  };

  // 필터 적용
  const filteredDeadlines = mockDeadlines.filter((deadline) => {
    if (filters.status?.length && !filters.status.includes(deadline.status)) {
      return false;
    }
    if (filters.priority?.length && !filters.priority.includes(deadline.priority)) {
      return false;
    }
    if (filters.type?.length && !filters.type.includes(deadline.type)) {
      return false;
    }
    return true;
  });

  const renderCalendarDays = () => {
    const days = [];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    // Day names header
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={`header-${i}`}
          className={cn(
            "p-2 text-center text-sm font-medium",
            i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-6"
          )}
        >
          {dayNames[i]}
        </div>
      );
    }

    // Empty cells before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const deadlines = getDeadlinesForDay(day);
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={cn(
            "min-h-28 border border-gray-2 p-2 transition-colors hover:bg-gray-1",
            isToday && "bg-brand-primary/5"
          )}
        >
          <div
            className={cn(
              "mb-1 text-sm font-medium",
              isToday
                ? "flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white"
                : "text-gray-9"
            )}
          >
            {day}
          </div>
          <div className="space-y-1">
            {deadlines.slice(0, 3).map((deadline) => (
              <button
                key={deadline.id}
                onClick={() => handleDeadlineClick(deadline)}
                className={cn(
                  "w-full truncate rounded px-1.5 py-0.5 text-left text-xs transition-opacity hover:opacity-80",
                  typeColors[deadline.type]
                )}
              >
                {deadline.title}
              </button>
            ))}
            {deadlines.length > 3 && (
              <div className="text-xs text-gray-5">
                +{deadlines.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* View Toggle & Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <Calendar className="mr-1 h-4 w-4" />
            캘린더
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-1 h-4 w-4" />
            리스트
          </Button>
        </div>
        <DeadlineFilter value={filters} onChange={setFilters} />
      </div>

      {viewMode === "calendar" ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {year}년 {month + 1}월
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                오늘
              </Button>
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7">{renderCalendarDays()}</div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">마감 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDeadlines.length === 0 ? (
                <div className="py-12 text-center text-gray-5">
                  해당하는 마감이 없습니다.
                </div>
              ) : (
                filteredDeadlines.map((deadline) => (
                  <button
                    key={deadline.id}
                    onClick={() => handleDeadlineClick(deadline)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-3 p-4 text-left transition-colors hover:bg-gray-1"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          typeColors[deadline.type]
                        )}
                      >
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-9">{deadline.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-5">
                          <span>{deadline.dueDate}</span>
                          <Badge variant="outline" className="text-xs">
                            {typeLabels[deadline.type]}
                          </Badge>
                          {deadline.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              반복
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColors[deadline.status]}>
                        {statusLabels[deadline.status]}
                      </Badge>
                      <DDayBadge dueDate={deadline.dueDate} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals & Panels */}
      <DeadlineFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedDeadline(null);
        }}
        deadline={selectedDeadline}
      />

      <DeadlineDetailPanel
        deadline={selectedDeadline}
        isOpen={isDetailPanelOpen}
        onClose={() => {
          setIsDetailPanelOpen(false);
          setSelectedDeadline(null);
        }}
        onEdit={handleEdit}
      />
    </div>
  );
}
