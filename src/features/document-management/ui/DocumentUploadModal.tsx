"use client";

import { useState, useCallback, useRef } from "react";
import { X, Upload, File, FileText, Image, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useUploadDocument } from "../hooks/useDocuments";
import { toast } from "sonner";
import type { DocumentCategory } from "@/shared/types";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadlineId?: number;
  onSuccess?: () => void;
}

const categoryOptions: { value: DocumentCategory; label: string }[] = [
  { value: "invoice", label: "세금계산서" },
  { value: "receipt", label: "영수증" },
  { value: "contract", label: "계약서" },
  { value: "certificate", label: "증명서" },
  { value: "report", label: "보고서" },
  { value: "other", label: "기타" },
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("pdf")) return FileText;
  return File;
};

export function DocumentUploadModal({
  isOpen,
  onClose,
  deadlineId,
  onSuccess,
}: DocumentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDocument();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "other" as DocumentCategory,
    expires_at: "",
  });

  const resetForm = () => {
    setSelectedFile(null);
    setFormData({
      title: "",
      category: "other",
      expires_at: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.title) {
        setFormData((prev) => ({ ...prev, title: file.name }));
      }
    }
  }, [formData.title]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.title) {
        setFormData((prev) => ({ ...prev, title: file.name }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("파일을 선택해주세요");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        metadata: {
          title: formData.title,
          category: formData.category,
          deadline_id: deadlineId,
          expires_at: formData.expires_at || undefined,
        },
      });

      toast.success("문서가 업로드되었습니다");
      handleClose();
      onSuccess?.();
    } catch {
      toast.error("업로드에 실패했습니다");
    }
  };

  if (!isOpen) return null;

  const FileIcon = selectedFile ? getFileIcon(selectedFile.type) : File;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-3 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-9">문서 업로드</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 hover:bg-gray-2"
          >
            <X className="h-5 w-5 text-gray-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "mb-4 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              isDragging
                ? "border-brand-primary bg-brand-primary/5"
                : selectedFile
                  ? "border-green-300 bg-green-50"
                  : "border-gray-3 hover:border-gray-4"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx,.hwp"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileIcon className="h-12 w-12 text-green-500" />
                <p className="font-medium text-gray-9">{selectedFile.name}</p>
                <p className="text-sm text-gray-5">
                  {formatFileSize(selectedFile.size)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  파일 변경
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-gray-4" />
                <p className="font-medium text-gray-7">
                  파일을 드래그하거나 클릭하여 선택
                </p>
                <p className="text-sm text-gray-5">
                  PDF, 이미지, 문서 파일 (최대 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Title */}
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
              placeholder="문서 제목"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-7">
              분류
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: option.value }))
                  }
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    formData.category === option.value
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-gray-3 text-gray-6 hover:border-gray-4"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expiration Date */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-7">
              유효기간 (선택)
            </label>
            <input
              type="date"
              value={formData.expires_at}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expires_at: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={uploadMutation.isPending || !selectedFile}
              className="gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  업로드
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
