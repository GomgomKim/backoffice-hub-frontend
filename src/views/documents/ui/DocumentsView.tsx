"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Grid,
  List,
} from "lucide-react";
import { useHeader } from "@/shared/context/HeaderContext";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import {
  DocumentUploadModal,
  DocumentCard,
  DocumentFilter,
  useDocuments,
  useDocumentStats,
  useExpiringDocuments,
  type DocumentFilterValues,
} from "@/features/document-management";
import type { DocumentStatus, DocumentCategory } from "@/shared/types";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | DocumentStatus;

export function DocumentsView() {
  const { setHeader } = useHeader();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [filters, setFilters] = useState<DocumentFilterValues>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Build query params from filters
  const queryParams = {
    status: statusFilter !== "all" ? statusFilter : filters.status?.[0],
    category: filters.category?.[0],
  };

  const { data: documents = [], isLoading, refetch } = useDocuments(queryParams);
  const { data: stats } = useDocumentStats();
  const { data: expiringDocuments = [] } = useExpiringDocuments(30);

  useEffect(() => {
    setHeader({
      title: "증빙 관리",
      subtitle: "업무 관련 증빙 서류를 관리하세요",
      actions: (
        <Button className="gap-2" onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="h-4 w-4" />
          증빙 업로드
        </Button>
      ),
    });
  }, [setHeader]);

  const handleStatusFilterClick = (status: StatusFilter) => {
    setStatusFilter(status);
    // Clear advanced filters when using quick filters
    setFilters({});
  };

  const handleFilterChange = (newFilters: DocumentFilterValues) => {
    setFilters(newFilters);
    // Reset quick filter when using advanced filters
    setStatusFilter("all");
  };

  const statusButtons: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "pending", label: "검토 대기" },
    { value: "verified", label: "검증 완료" },
    { value: "expired", label: "만료" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-5">전체 문서</p>
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-5">검토 대기</p>
              <p className="text-2xl font-bold">
                {stats?.byStatus?.pending || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-5">검증 완료</p>
              <p className="text-2xl font-bold">
                {stats?.byStatus?.verified || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-5">만료 예정</p>
              <p className="text-2xl font-bold">{expiringDocuments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {statusButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={statusFilter === btn.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilterClick(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-r-none",
                viewMode === "list" && "bg-gray-2"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-l-none",
                viewMode === "grid" && "bg-gray-2"
              )}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <DocumentFilter value={filters} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>증빙 목록</span>
            <span className="text-sm font-normal text-gray-5">
              {documents.length}개
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg bg-gray-2"
                />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-4" />
              <p className="mt-2 text-gray-5">등록된 문서가 없습니다</p>
              <Button
                className="mt-4 gap-2"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="h-4 w-4" />
                첫 번째 문서 업로드
              </Button>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onUpdate={() => refetch()}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onUpdate={() => refetch()}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Documents Alert */}
      {expiringDocuments.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              만료 예정 문서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringDocuments.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">{doc.title}</span>
                  </div>
                  <span className="text-sm text-orange-600">
                    {doc.expiresAt &&
                      new Date(doc.expiresAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              ))}
              {expiringDocuments.length > 3 && (
                <p className="text-center text-sm text-orange-600">
                  외 {expiringDocuments.length - 3}개
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
