import { NextRequest, NextResponse } from "next/server";
import { backendRequest, handleBackendError, internalErrorResponse } from "../../../utils";

// GET /api/integrations/[systemType]/status - Get integration status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ systemType: string }> }
) {
  try {
    const { systemType } = await params;
    const response = await backendRequest(
      `/api/v1/integrations/${systemType}/status`,
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
