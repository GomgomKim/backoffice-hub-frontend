"use client";

import { useEffect } from "react";
import { Upload, FileText, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
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

// Mock data
const mockDocuments = [
  {
    id: "1",
    title: "2024년 1월 급여대장",
    category: "report",
    status: "verified",
    uploadedAt: "2024-02-01",
    deadline: "원천세 신고",
  },
  {
    id: "2",
    title: "법인카드 영수증 (2024.01)",
    category: "receipt",
    status: "pending",
    uploadedAt: "2024-02-03",
    deadline: "법인카드 정산",
  },
  {
    id: "3",
    title: "계약서 - ABC 프로젝트",
    category: "contract",
    status: "verified",
    uploadedAt: "2024-01-15",
    deadline: null,
  },
  {
    id: "4",
    title: "사업자등록증",
    category: "certificate",
    status: "expired",
    uploadedAt: "2023-06-01",
    deadline: null,
  },
];

const categoryLabels: Record<string, string> = {
  invoice: "세금계산서",
  receipt: "영수증",
  contract: "계약서",
  certificate: "증명서",
  report: "보고서",
  other: "기타",
};

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  pending: { label: "검토 대기", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  verified: { label: "검증 완료", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  rejected: { label: "반려", icon: XCircle, color: "bg-red-100 text-red-800" },
  expired: { label: "만료", icon: XCircle, color: "bg-gray-100 text-gray-800" },
};

export function DocumentsView() {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "증빙 관리",
      subtitle: "업무 관련 증빙 서류를 관리하세요",
      actions: (
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          증빙 업로드
        </Button>
      ),
    });
  }, [setHeader]);

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
              <p className="text-2xl font-bold">24</p>
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
              <p className="text-2xl font-bold">5</p>
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
              <p className="text-2xl font-bold">18</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-5">만료 예정</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {["전체", "검토 대기", "검증 완료", "만료"].map((filter) => (
            <Button
              key={filter}
              variant={filter === "전체" ? "default" : "outline"}
              size="sm"
            >
              {filter}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-1 h-4 w-4" />
          필터
        </Button>
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>증빙 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDocuments.map((doc) => {
              const status = statusConfig[doc.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-gray-3 p-4 transition-colors hover:bg-gray-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-2">
                      <FileText className="h-6 w-6 text-gray-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-9">{doc.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-5">
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[doc.category]}
                        </Badge>
                        <span>|</span>
                        <span>{doc.uploadedAt}</span>
                        {doc.deadline && (
                          <>
                            <span>|</span>
                            <span>{doc.deadline}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
                        status.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </div>
                    <Button variant="ghost" size="sm">
                      상세
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
