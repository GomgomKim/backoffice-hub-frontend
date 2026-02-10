import { NextRequest, NextResponse } from "next/server";
import { backendRequest, handleBackendError, internalErrorResponse } from "../../utils";

// PATCH /api/notifications/read-all
export async function PATCH(request: NextRequest) {
  try {
    const response = await backendRequest(
      "/api/v1/notifications/read-all",
      { method: "PATCH" },
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
