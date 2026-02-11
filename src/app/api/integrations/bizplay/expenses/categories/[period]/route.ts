import { NextRequest, NextResponse } from "next/server";
import { backendRequest, handleBackendError, internalErrorResponse } from "../../../../../utils";

// GET /api/integrations/bizplay/expenses/categories/[period] - Get Bizplay category breakdown
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ period: string }> }
) {
  try {
    const { period } = await params;
    const response = await backendRequest(
      `/api/v1/integrations/bizplay/expenses/categories/${period}`,
      { method: "GET", cache: "no-store" },
      request
    );

    if (!response.ok) {
      return handleBackendError(response);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return internalErrorResponse(error);
  }
}
