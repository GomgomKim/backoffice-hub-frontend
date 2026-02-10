"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { DeadlineStatus, DeadlinePriority, DeadlineType } from "@/shared/types";

export interface DeadlineFilterValues {
  status?: DeadlineStatus[];
  priority?: DeadlinePriority[];
  type?: DeadlineType[];
  dateRange?: {
    from?: string;
    to?: string;
  };
}

interface DeadlineFilterProps {
  value: DeadlineFilterValues;
  onChange: (value: DeadlineFilterValues) => void;
  className?: string;
}

const statusOptions: { value: DeadlineStatus; label: string }[] = [
  { value: "pending", label: "대기" },
  { value: "in_progress", label: "진행중" },
  { value: "completed", label: "완료" },
  { value: "overdue", label: "지연" },
];

const priorityOptions: { value: DeadlinePriority; label: string }[] = [
  { value: "high", label: "높음" },
  { value: "medium", label: "보통" },
  { value: "low", label: "낮음" },
];

const typeOptions: { value: DeadlineType; label: string }[] = [
  { value: "payroll", label: "급여" },
  { value: "tax", label: "세무" },
  { value: "admin", label: "행정" },
  { value: "external", label: "외부" },
];

export function DeadlineFilter({
  value,
  onChange,
  className,
}: DeadlineFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (status: DeadlineStatus) => {
    const current = value.status || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onChange({ ...value, status: updated.length > 0 ? updated : undefined });
  };

  const togglePriority = (priority: DeadlinePriority) => {
    const current = value.priority || [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onChange({ ...value, priority: updated.length > 0 ? updated : undefined });
  };

  const toggleType = (type: DeadlineType) => {
    const current = value.type || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...value, type: updated.length > 0 ? updated : undefined });
  };

  const clearFilters = () => {
    onChange({});
    setIsOpen(false);
  };

  const activeFilterCount =
    (value.status?.length || 0) +
    (value.priority?.length || 0) +
    (value.type?.length || 0);

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Filter className="h-4 w-4" />
        필터
        {activeFilterCount > 0 && (
          <Badge variant="default" className="ml-1 h-5 px-1.5">
            {activeFilterCount}
          </Badge>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-3 bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-gray-9">필터</h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-xs text-gray-5 hover:text-gray-9"
              >
                <X className="mr-1 h-3 w-3" />
                초기화
              </Button>
            )}
          </div>

          {/* 상태 필터 */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-7">상태</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    value.status?.includes(option.value)
                      ? "bg-brand-primary text-white"
                      : "bg-gray-2 text-gray-6 hover:bg-gray-3"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 우선순위 필터 */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-7">우선순위</p>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => togglePriority(option.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    value.priority?.includes(option.value)
                      ? "bg-brand-primary text-white"
                      : "bg-gray-2 text-gray-6 hover:bg-gray-3"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 유형 필터 */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-7">유형</p>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleType(option.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    value.type?.includes(option.value)
                      ? "bg-brand-primary text-white"
                      : "bg-gray-2 text-gray-6 hover:bg-gray-3"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
