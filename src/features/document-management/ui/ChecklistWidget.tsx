"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  FileText,
  Link2,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import {
  useChecklist,
  useToggleChecklistItem,
  useLinkDocumentToChecklistItem,
} from "../hooks/useDocuments";
import { DocumentUploadModal } from "./DocumentUploadModal";
import type { ChecklistItem } from "@/shared/types";

interface ChecklistWidgetProps {
  deadlineId: number;
  className?: string;
  compact?: boolean;
}

export function ChecklistWidget({
  deadlineId,
  className,
  compact = false,
}: ChecklistWidgetProps) {
  const { data: checklist, isLoading } = useChecklist(deadlineId);
  const toggleMutation = useToggleChecklistItem();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedItemForUpload, setSelectedItemForUpload] =
    useState<string | null>(null);

  const handleToggle = async (item: ChecklistItem) => {
    try {
      await toggleMutation.mutateAsync({
        deadlineId,
        itemId: item.id,
        isCompleted: !item.isCompleted,
      });
    } catch {
      // Error handled by mutation
    }
  };

  const handleUploadClick = (itemId: string) => {
    setSelectedItemForUpload(itemId);
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    setSelectedItemForUpload(null);
    setIsUploadModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-4 w-24 rounded bg-gray-2" />
        <div className="mt-2 h-2 w-full rounded bg-gray-2" />
        <div className="mt-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded bg-gray-2" />
          ))}
        </div>
      </div>
    );
  }

  if (!checklist) {
    return null;
  }

  const completedCount = checklist.items.filter((i) => i.isCompleted).length;
  const totalCount = checklist.items.length;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-medium text-gray-9">
          <FileText className="h-4 w-4" />
          체크리스트
        </h4>
        <span className="text-sm text-gray-5">
          {completedCount}/{totalCount} 완료
        </span>
      </div>

      {/* Progress */}
      <Progress value={checklist.completionRate} className="mb-3 h-2" />

      {/* Items */}
      <div className="space-y-2">
        {checklist.items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-colors",
              item.isCompleted
                ? "border-green-200 bg-green-50"
                : "border-gray-2 hover:bg-gray-1"
            )}
          >
            {/* Checkbox */}
            <button
              onClick={() => handleToggle(item)}
              disabled={toggleMutation.isPending}
              className="flex-shrink-0"
            >
              {item.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-4" />
              )}
            </button>

            {/* Title & Status */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm",
                  item.isCompleted && "text-gray-5 line-through"
                )}
              >
                {item.title}
              </p>
              {!compact && (
                <div className="mt-1 flex items-center gap-2">
                  {item.isRequired && (
                    <Badge variant="outline" className="text-xs">
                      필수
                    </Badge>
                  )}
                  {item.documentId && (
                    <Badge
                      variant="outline"
                      className="gap-1 text-xs text-green-600"
                    >
                      <Link2 className="h-3 w-3" />
                      문서 연결됨
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Upload Button */}
            {!item.documentId && !compact && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
                onClick={() => handleUploadClick(item.id)}
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedItemForUpload(null);
        }}
        deadlineId={deadlineId}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
