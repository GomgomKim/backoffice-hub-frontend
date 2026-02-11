"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useAIAssist, useAIStatus } from "../hooks/useAI";

interface AIAssistantWidgetProps {
  className?: string;
  defaultExpanded?: boolean;
  context?: Record<string, unknown>;
}

export function AIAssistantWidget({
  className,
  defaultExpanded = false,
  context,
}: AIAssistantWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<{
    text: string;
    suggestions: string[];
    tips: string[];
  } | null>(null);

  const { data: status } = useAIStatus();
  const { mutate: assist, isPending } = useAIAssist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isPending) return;

    assist(
      { query, context },
      {
        onSuccess: (result) => {
          setResponse({
            text: result.response,
            suggestions: result.suggestions,
            tips: result.relatedData?.tips || [],
          });
          setQuery("");
        },
      }
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">AI 어시스턴트</CardTitle>
              <CardDescription className="text-xs">
                업무 관련 질문에 답변해 드립니다
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant={status.useMock ? "secondary" : "success"} className="text-xs">
                {status.useMock ? "Demo" : "Live"}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-5" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-5" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Response Display */}
          {response && (
            <div className="space-y-3 rounded-lg bg-gray-1 p-3">
              <p className="text-sm text-gray-9">{response.text}</p>

              {response.suggestions.length > 0 && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1 text-xs font-medium text-gray-6">
                    <Lightbulb className="h-3 w-3" />
                    제안
                  </p>
                  <ul className="space-y-1">
                    {response.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-gray-7">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {response.tips.length > 0 && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1 text-xs font-medium text-gray-6">
                    <AlertTriangle className="h-3 w-3" />
                    팁
                  </p>
                  <ul className="space-y-1">
                    {response.tips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-gray-7">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="질문을 입력하세요..."
              className="flex-1 rounded-lg border border-gray-3 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
              disabled={isPending}
            />
            <Button type="submit" size="sm" disabled={isPending || !query.trim()}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Quick Questions */}
          <div className="flex flex-wrap gap-1.5">
            {[
              "이번 달 마감 현황은?",
              "미처리 증빙이 있나요?",
              "다음 주 일정 알려줘",
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuery(q)}
                className="rounded-full bg-gray-2 px-2.5 py-1 text-xs text-gray-6 hover:bg-gray-3 hover:text-gray-9"
              >
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
