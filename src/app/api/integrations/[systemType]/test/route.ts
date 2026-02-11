import { NextRequest, NextResponse } from "next/server";
import { backendRequest, handleBackendError, internalErrorResponse } from "../../../utils";

// POST /api/integrations/[systemType]/test - Test connection
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ systemType: string }> }
) {
  try {
    const { systemType } = await params;
    const response = await backendRequest(
      `/api/v1/integrations/${systemType}/test`,
      { method: "POST" },
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
