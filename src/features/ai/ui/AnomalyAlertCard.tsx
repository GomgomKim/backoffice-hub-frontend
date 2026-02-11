"use client";

import { AlertTriangle, TrendingUp, ShieldAlert, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import type { AnomalyResult, AnomalyItem } from "../types";

interface AnomalyAlertCardProps {
  result: AnomalyResult;
  className?: string;
}

export function AnomalyAlertCard({ result, className }: AnomalyAlertCardProps) {
  const severityColors: Record<AnomalyItem["severity"], string> = {
    critical: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const severityLabels: Record<AnomalyItem["severity"], string> = {
    critical: "심각",
    high: "높음",
    medium: "보통",
    low: "낮음",
  };

  const riskColor = (score: number) => {
    if (score >= 0.7) return "text-status-danger";
    if (score >= 0.4) return "text-status-warning";
    return "text-status-safe";
  };

  if (!result.hasAnomalies) {
    return (
      <Card className={cn("border-green-200 bg-green-50", className)}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <ShieldAlert className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">이상 없음</p>
            <p className="text-sm text-green-600">
              분석된 데이터에서 이상 패턴이 감지되지 않았습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-orange-200", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base">이상 탐지 결과</CardTitle>
              <CardDescription className="text-xs">
                {result.anomalies.length}건의 이상 패턴이 감지되었습니다
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-5">위험 점수</p>
            <p className={cn("text-xl font-bold", riskColor(result.riskScore))}>
              {Math.round(result.riskScore * 100)}
            </p>
          </div>
        </div>
        <Progress value={result.riskScore * 100} className="mt-2 h-1.5" />
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Summary */}
        {result.summary && (
          <div className="flex items-start gap-2 rounded-lg bg-gray-1 p-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-5" />
            <p className="text-sm text-gray-7">{result.summary}</p>
          </div>
        )}

        {/* Anomalies List */}
        <div className="space-y-2">
          {result.anomalies.slice(0, 3).map((anomaly, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-lg border p-3",
                severityColors[anomaly.severity]
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {anomaly.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {severityLabels[anomaly.severity]}
                </Badge>
              </div>
              <p className="text-sm font-medium">{anomaly.description}</p>
              {anomaly.amount && (
                <p className="mt-1 text-xs opacity-80">
                  금액: {anomaly.amount.toLocaleString()}원
                  {anomaly.threshold && (
                    <> (기준: {anomaly.threshold.toLocaleString()}원)</>
                  )}
                </p>
              )}
              {anomaly.recommendation && (
                <p className="mt-1.5 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  {anomaly.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="mb-1.5 text-xs font-medium text-blue-800">권고사항</p>
            <ul className="space-y-1">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-blue-700">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
