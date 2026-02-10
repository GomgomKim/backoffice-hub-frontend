import { NextRequest, NextResponse } from "next/server";
import { backendRequest, handleBackendError, internalErrorResponse } from "../../utils";

// GET /api/notifications/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await backendRequest(
      `/api/v1/notifications/${id}`,
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

// DELETE /api/notifications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await backendRequest(
      `/api/v1/notifications/${id}`,
      { method: "DELETE" },
      request
    );

    if (!response.ok) {
      return handleBackendError(response);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return internalErrorResponse(error);
  }
}
