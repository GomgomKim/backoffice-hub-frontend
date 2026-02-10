"use client";

import { useState, useEffect } from "react";
import { X, Calendar, AlertCircle, Repeat } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Deadline, DeadlinePriority, DeadlineType } from "@/shared/types";
import { useCreateDeadline, useUpdateDeadline, useDeadlineTypes } from "../hooks/useDeadlines";
import { toast } from "sonner";

interface DeadlineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadline?: Deadline | null;
}

const priorityOptions: { value: DeadlinePriority; label: string; color: string }[] = [
  { value: "high", label: "높음", color: "bg-red-100 text-red-700" },
  { value: "medium", label: "보통", color: "bg-yellow-100 text-yellow-700" },
  { value: "low", label: "낮음", color: "bg-green-100 text-green-700" },
];

const typeLabels: Record<string, string> = {
  payroll: "급여",
  tax: "세무",
  admin: "행정",
  external: "외부",
};

const recurringOptions = [
  { value: "monthly", label: "매월" },
  { value: "quarterly", label: "분기별" },
  { value: "yearly", label: "매년" },
];

export function DeadlineFormModal({
  isOpen,
  onClose,
  deadline,
}: DeadlineFormModalProps) {
  const isEditing = !!deadline;
  const { data: deadlineTypes = [] } = useDeadlineTypes();
  const createMutation = useCreateDeadline();
  const updateMutation = useUpdateDeadline();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium" as DeadlinePriority,
    deadline_type_id: undefined as number | undefined,
    is_recurring: false,
    recurring_pattern: "monthly",
  });

  useEffect(() => {
    if (deadline) {
      setFormData({
        title: deadline.title,
        description: deadline.description || "",
        due_date: deadline.dueDate.split("T")[0],
        priority: deadline.priority,
        deadline_type_id: undefined, // API에서 받아온 데이터 사용
        is_recurring: deadline.isRecurring,
        recurring_pattern: deadline.recurringPattern || "monthly",
      });
    } else {
      // Reset form for new deadline
      setFormData({
        title: "",
        description: "",
        due_date: new Date().toISOString().split("T")[0],
        priority: "medium",
        deadline_type_id: undefined,
        is_recurring: false,
        recurring_pattern: "monthly",
      });
    }
  }, [deadline, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }

    if (!formData.due_date) {
      toast.error("마감일을 선택해주세요");
      return;
    }

    try {
      if (isEditing && deadline) {
        await updateMutation.mutateAsync({
          id: deadline.id,
          payload: {
            title: formData.title,
            description: formData.description || undefined,
            due_date: formData.due_date,
            priority: formData.priority,
          },
        });
        toast.success("마감이 수정되었습니다");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description || undefined,
          due_date: formData.due_date,
          priority: formData.priority,
          deadline_type_id: formData.deadline_type_id,
          is_recurring: formData.is_recurring,
          recurring_pattern: formData.is_recurring
            ? formData.recurring_pattern
            : undefined,
        });
        toast.success("마감이 생성되었습니다");
      }
      onClose();
    } catch (error) {
      toast.error(isEditing ? "마감 수정에 실패했습니다" : "마감 생성에 실패했습니다");
    }
  };

  const handleDeadlineTypeSelect = (typeId: number) => {
    const selectedType = deadlineTypes.find((t) => t.id === typeId);
    if (selectedType) {
      setFormData((prev) => ({
        ...prev,
        deadline_type_id: typeId,
        title: prev.title || selectedType.name,
        is_recurring: selectedType.is_recurring,
        recurring_pattern: selectedType.recurring_pattern || "monthly",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-3 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-9">
            {isEditing ? "마감 수정" : "마감 추가"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-2"
          >
            <X className="h-5 w-5 text-gray-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* 마감 유형 선택 (신규 생성 시에만) */}
          {!isEditing && deadlineTypes.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-7">
                마감 유형 (선택)
              </label>
              <div className="flex flex-wrap gap-2">
                {deadlineTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleDeadlineTypeSelect(type.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      formData.deadline_type_id === type.id
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                        : "border-gray-3 text-gray-6 hover:border-gray-4"
                    )}
                  >
                    <span className="font-medium">{type.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {typeLabels[type.category] || type.category}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 제목 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-7">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              placeholder="마감 제목을 입력하세요"
            />
          </div>

          {/* 설명 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-7">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="h-20 w-full resize-none rounded-lg border border-gray-3 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              placeholder="마감에 대한 설명을 입력하세요 (선택)"
            />
          </div>

          {/* 마감일 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-7">
              마감일 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-5" />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, due_date: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-3 py-2 pl-10 pr-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* 우선순위 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-7">
              우선순위
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, priority: option.value }))
                  }
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                    formData.priority === option.value
                      ? cn(option.color, "border-transparent")
                      : "border-gray-3 text-gray-6 hover:border-gray-4"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 반복 설정 (신규 생성 시에만) */}
          {!isEditing && (
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_recurring"
                  checked={formData.is_recurring}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_recurring: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-3 text-brand-primary focus:ring-brand-primary"
                />
                <label
                  htmlFor="is_recurring"
                  className="flex items-center gap-1 text-sm font-medium text-gray-7"
                >
                  <Repeat className="h-4 w-4" />
                  반복 마감
                </label>
              </div>

              {formData.is_recurring && (
                <div className="ml-6 flex gap-2">
                  {recurringOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          recurring_pattern: option.value,
                        }))
                      }
                      className={cn(
                        "rounded-lg border px-3 py-1 text-xs transition-colors",
                        formData.recurring_pattern === option.value
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                          : "border-gray-3 text-gray-6 hover:border-gray-4"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "저장 중..."
                : isEditing
                  ? "수정"
                  : "추가"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
