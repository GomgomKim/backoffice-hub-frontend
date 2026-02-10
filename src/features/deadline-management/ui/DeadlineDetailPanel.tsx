"use client";

import {
  X,
  Calendar,
  User,
  Flag,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  FileText,
  Repeat,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { DDayBadge } from "./DDayBadge";
import type { Deadline } from "@/shared/types";
import { useCompleteDeadline, useDeleteDeadline } from "../hooks/useDeadlines";
import { toast } from "sonner";

interface DeadlineDetailPanelProps {
  deadline: Deadline | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (deadline: Deadline) => void;
}

const statusLabels: Record<string, string> = {
  pending: "대기",
  in_progress: "진행중",
  completed: "완료",
  overdue: "지연",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

const priorityLabels: Record<string, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const priorityColors: Record<string, string> = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-green-600",
};

const typeLabels: Record<string, string> = {
  payroll: "급여",
  tax: "세무",
  admin: "행정",
  external: "외부",
};

export function DeadlineDetailPanel({
  deadline,
  isOpen,
  onClose,
  onEdit,
}: DeadlineDetailPanelProps) {
  const completeMutation = useCompleteDeadline();
  const deleteMutation = useDeleteDeadline();

  const handleComplete = async () => {
    if (!deadline) return;

    try {
      await completeMutation.mutateAsync(deadline.id);
      toast.success("마감이 완료 처리되었습니다");
    } catch {
      toast.error("완료 처리에 실패했습니다");
    }
  };

  const handleDelete = async () => {
    if (!deadline) return;

    if (!confirm("정말 이 마감을 삭제하시겠습니까?")) return;

    try {
      await deleteMutation.mutateAsync(deadline.id);
      toast.success("마감이 삭제되었습니다");
      onClose();
    } catch {
      toast.error("삭제에 실패했습니다");
    }
  };

  if (!isOpen || !deadline) return null;

  // Mock checklist data - 실제로는 API에서 가져옴
  const checklist = {
    items: [
      { id: "1", title: "급여대장 확인", isCompleted: true, isRequired: true },
      { id: "2", title: "원천징수영수증 작성", isCompleted: true, isRequired: true },
      { id: "3", title: "전자신고", isCompleted: false, isRequired: true },
      { id: "4", title: "납부", isCompleted: false, isRequired: true },
    ],
    completionRate: 50,
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="w-96 overflow-y-auto bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-3 bg-white px-6 py-4">
          <h2 className="font-semibold text-gray-9">마감 상세</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-2"
          >
            <X className="h-5 w-5 text-gray-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & D-Day */}
          <div className="mb-6">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-9">{deadline.title}</h3>
              <DDayBadge dueDate={deadline.dueDate} size="lg" />
            </div>
            {deadline.description && (
              <p className="text-sm text-gray-6">{deadline.description}</p>
            )}
          </div>

          {/* Status & Actions */}
          <div className="mb-6 flex items-center gap-2">
            <Badge className={cn("px-3 py-1", statusColors[deadline.status])}>
              {statusLabels[deadline.status]}
            </Badge>
            {deadline.isRecurring && (
              <Badge variant="outline" className="gap-1">
                <Repeat className="h-3 w-3" />
                반복
              </Badge>
            )}
          </div>

          {/* Info Grid */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-5" />
              <div>
                <p className="text-xs text-gray-5">마감일</p>
                <p className="font-medium text-gray-9">{deadline.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Flag className={cn("h-5 w-5", priorityColors[deadline.priority])} />
              <div>
                <p className="text-xs text-gray-5">우선순위</p>
                <p className="font-medium text-gray-9">
                  {priorityLabels[deadline.priority]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-5" />
              <div>
                <p className="text-xs text-gray-5">유형</p>
                <p className="font-medium text-gray-9">
                  {typeLabels[deadline.type] || deadline.type}
                </p>
              </div>
            </div>

            {deadline.assignee && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-5" />
                <div>
                  <p className="text-xs text-gray-5">담당자</p>
                  <p className="font-medium text-gray-9">
                    {deadline.assignee.name}
                  </p>
                </div>
              </div>
            )}

            {deadline.score > 0 && (
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-5">스코어</p>
                  <p className="font-medium text-gray-9">{deadline.score}점</p>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Checklist */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-medium text-gray-9">
                <FileText className="h-4 w-4" />
                체크리스트
              </h4>
              <span className="text-sm text-gray-5">
                {checklist.completionRate}% 완료
              </span>
            </div>
            <Progress value={checklist.completionRate} className="mb-3 h-2" />
            <div className="space-y-2">
              {checklist.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg border border-gray-2 p-2"
                >
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    readOnly
                    className="h-4 w-4 rounded border-gray-3"
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      item.isCompleted && "text-gray-5 line-through"
                    )}
                  >
                    {item.title}
                  </span>
                  {item.isRequired && (
                    <Badge variant="outline" className="text-xs">
                      필수
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Actions */}
          <div className="space-y-2">
            {deadline.status !== "completed" && (
              <Button
                className="w-full gap-2"
                onClick={handleComplete}
                disabled={completeMutation.isPending}
              >
                <CheckCircle className="h-4 w-4" />
                {completeMutation.isPending ? "처리 중..." : "완료 처리"}
              </Button>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => onEdit(deadline)}
              >
                <Edit className="h-4 w-4" />
                수정
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
