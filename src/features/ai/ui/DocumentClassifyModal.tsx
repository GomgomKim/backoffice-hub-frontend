"use client";

import { useState } from "react";
import {
  FileSearch,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Info,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import { useClassifyDocument } from "../hooks/useAI";
import type { DocumentClassifyResult } from "../types";

interface DocumentClassifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassified?: (result: DocumentClassifyResult) => void;
}

export function DocumentClassifyModal({
  open,
  onOpenChange,
  onClassified,
}: DocumentClassifyModalProps) {
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("");
  const [result, setResult] = useState<DocumentClassifyResult | null>(null);

  const { mutate: classify, isPending } = useClassifyDocument();

  const handleClassify = () => {
    if (!content.trim()) return;

    classify(
      { content, filename: filename || undefined },
      {
        onSuccess: (data) => {
          setResult(data);
          onClassified?.(data);
        },
      }
    );
  };

  const handleClose = () => {
    setContent("");
    setFilename("");
    setResult(null);
    onOpenChange(false);
  };

  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-status-safe";
    if (confidence >= 0.5) return "text-status-warning";
    return "text-status-danger";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5" />
            AI 문서 분류
          </DialogTitle>
          <DialogDescription>
            문서 내용을 입력하면 AI가 자동으로 카테고리를 분류합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input Section */}
          {!result && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-7">
                  파일명 (선택)
                </label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="예: 2026년_2월_세금계산서.pdf"
                  className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-7">
                  문서 내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="문서의 텍스트 내용을 붙여넣기 하세요..."
                  rows={8}
                  className="w-full resize-none rounded-lg border border-gray-3 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-5">
                  최소 10자 이상의 문서 내용이 필요합니다.
                </p>
              </div>

              <Button
                onClick={handleClassify}
                disabled={isPending || content.length < 10}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분류 중...
                  </>
                ) : (
                  <>
                    <FileSearch className="mr-2 h-4 w-4" />
                    문서 분류하기
                  </>
                )}
              </Button>
            </>
          )}

          {/* Result Section */}
          {result && (
            <div className="space-y-4">
              {/* Success/Error Header */}
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg p-3",
                  result.success ? "bg-green-50" : "bg-red-50"
                )}
              >
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-status-safe" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-status-danger" />
                )}
                <span className={cn("font-medium", result.success ? "text-status-safe" : "text-status-danger")}>
                  {result.success ? "분류 완료" : "분류 실패"}
                </span>
              </div>

              {result.success && (
                <>
                  {/* Category Result */}
                  <div className="rounded-lg border border-gray-3 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-9">
                          {result.categoryName}
                        </p>
                        <p className="text-sm text-gray-5">{result.subcategory}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-5">신뢰도</p>
                        <p className={cn("text-2xl font-bold", confidenceColor(result.confidence))}>
                          {Math.round(result.confidence * 100)}%
                        </p>
                      </div>
                    </div>
                    <Progress value={result.confidence * 100} className="h-2" />
                  </div>

                  {/* Summary */}
                  {result.summary && (
                    <div className="rounded-lg bg-gray-1 p-3">
                      <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-6">
                        <Info className="h-3 w-3" />
                        요약
                      </p>
                      <p className="text-sm text-gray-8">{result.summary}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {result.tags.length > 0 && (
                    <div>
                      <p className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-6">
                        <Tag className="h-3 w-3" />
                        태그
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Info */}
                  {(result.keyInfo.date || result.keyInfo.amount) && (
                    <div className="grid grid-cols-2 gap-4">
                      {result.keyInfo.date && (
                        <div className="rounded-lg border border-gray-3 p-3">
                          <p className="text-xs text-gray-5">문서 날짜</p>
                          <p className="font-medium text-gray-9">{result.keyInfo.date}</p>
                        </div>
                      )}
                      {result.keyInfo.amount && (
                        <div className="rounded-lg border border-gray-3 p-3">
                          <p className="text-xs text-gray-5">금액</p>
                          <p className="font-medium text-gray-9">{result.keyInfo.amount}</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Error Message */}
              {!result.success && result.error && (
                <p className="text-sm text-status-danger">{result.error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setResult(null)} className="flex-1">
                  다시 분류하기
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  완료
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
