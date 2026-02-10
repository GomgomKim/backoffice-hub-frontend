"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { DocumentStatus, DocumentCategory } from "@/shared/types";

export interface DocumentFilterValues {
  status?: DocumentStatus[];
  category?: DocumentCategory[];
}

interface DocumentFilterProps {
  value: DocumentFilterValues;
  onChange: (value: DocumentFilterValues) => void;
  className?: string;
}

const statusOptions: { value: DocumentStatus; label: string }[] = [
  { value: "pending", label: "대기" },
  { value: "verified", label: "승인" },
  { value: "rejected", label: "반려" },
  { value: "expired", label: "만료" },
];

const categoryOptions: { value: DocumentCategory; label: string }[] = [
  { value: "invoice", label: "세금계산서" },
  { value: "receipt", label: "영수증" },
  { value: "contract", label: "계약서" },
  { value: "certificate", label: "증명서" },
  { value: "report", label: "보고서" },
  { value: "other", label: "기타" },
];

export function DocumentFilter({
  value,
  onChange,
  className,
}: DocumentFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (status: DocumentStatus) => {
    const current = value.status || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onChange({ ...value, status: updated.length > 0 ? updated : undefined });
  };

  const toggleCategory = (category: DocumentCategory) => {
    const current = value.category || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onChange({
      ...value,
      category: updated.length > 0 ? updated : undefined,
    });
  };

  const clearFilters = () => {
    onChange({});
    setIsOpen(false);
  };

  const activeFilterCount =
    (value.status?.length || 0) + (value.category?.length || 0);

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
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-3 bg-white p-4 shadow-lg">
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

          {/* Status Filter */}
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

          {/* Category Filter */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-7">분류</p>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleCategory(option.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    value.category?.includes(option.value)
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
