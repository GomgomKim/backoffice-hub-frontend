"use client";

import {
  FileText,
  File,
  Image,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { documentService } from "../api/documentService";
import { useVerifyDocument, useRejectDocument, useDeleteDocument } from "../hooks/useDocuments";
import { toast } from "sonner";
import type { Document, DocumentStatus, DocumentCategory } from "@/shared/types";
import { useState } from "react";

interface DocumentCardProps {
  document: Document;
  onUpdate?: () => void;
}

const statusConfig: Record<
  DocumentStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: "대기",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  verified: {
    label: "승인",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "반려",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  expired: {
    label: "만료",
    color: "bg-gray-100 text-gray-700",
    icon: AlertTriangle,
  },
};

const categoryLabels: Record<DocumentCategory, string> = {
  invoice: "세금계산서",
  receipt: "영수증",
  contract: "계약서",
  certificate: "증명서",
  report: "보고서",
  other: "기타",
};

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return File;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("pdf")) return FileText;
  return File;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function DocumentCard({ document, onUpdate }: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const verifyMutation = useVerifyDocument();
  const rejectMutation = useRejectDocument();
  const deleteMutation = useDeleteDocument();

  const status = statusConfig[document.status];
  const StatusIcon = status.icon;
  const FileIcon = getFileIcon(document.mimeType);

  const handleDownload = () => {
    const url = documentService.getDownloadUrl(document.id);
    window.open(url, "_blank");
  };

  const handleVerify = async () => {
    try {
      await verifyMutation.mutateAsync(document.id);
      toast.success("문서가 승인되었습니다");
      onUpdate?.();
    } catch {
      toast.error("승인에 실패했습니다");
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync(document.id);
      toast.success("문서가 반려되었습니다");
      onUpdate?.();
    } catch {
      toast.error("반려에 실패했습니다");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 문서를 삭제하시겠습니까?")) return;

    try {
      await deleteMutation.mutateAsync(document.id);
      toast.success("문서가 삭제되었습니다");
      onUpdate?.();
    } catch {
      toast.error("삭제에 실패했습니다");
    }
  };

  return (
    <div className="group rounded-lg border border-gray-2 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-1">
          <FileIcon className="h-6 w-6 text-gray-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-medium text-gray-9">
                {document.title}
              </h4>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-5">
                <Badge variant="outline" className="text-xs">
                  {categoryLabels[document.category]}
                </Badge>
                <Badge className={cn("gap-1 text-xs", status.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
                {document.fileSize && (
                  <span>{formatFileSize(document.fileSize)}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="relative flex items-center gap-1">
              {document.filePath && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-gray-2 bg-white py-1 shadow-lg">
                    {document.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            handleVerify();
                            setShowMenu(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-gray-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          승인
                        </button>
                        <button
                          onClick={() => {
                            handleReject();
                            setShowMenu(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-1"
                        >
                          <XCircle className="h-4 w-4" />
                          반려
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-5">
            <span>등록: {formatDate(document.createdAt)}</span>
            {document.expiresAt && (
              <span className="text-orange-600">
                만료: {formatDate(document.expiresAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
