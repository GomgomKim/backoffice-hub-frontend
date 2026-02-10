"use client";

import { useEffect } from "react";
import { CreditCard } from "lucide-react";
import { useHeader } from "@/shared/context/HeaderContext";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function ExpensesPage() {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "지출/법인카드",
      subtitle: "지출 및 법인카드 관리",
    });
  }, [setHeader]);

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <CreditCard className="h-12 w-12 text-gray-4" />
        <h2 className="mt-4 text-xl font-semibold text-gray-7">준비 중입니다</h2>
        <p className="mt-2 text-gray-5">
          지출/법인카드 관리 기능이 곧 출시됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
