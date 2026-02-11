import { NextRequest, NextResponse } from "next/server";
import {
  backendRequest,
  handleBackendError,
  internalErrorResponse,
} from "../../utils";

// GET /api/integrations/[systemType] - Get integration config
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ systemType: string }> }
) {
  try {
    const { systemType } = await params;
    const response = await backendRequest(
      `/api/v1/integrations/${systemType}`,
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

// POST /api/integrations/[systemType] - Create/Update integration config
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ systemType: string }> }
) {
  try {
    const { systemType } = await params;
    const body = await request.json().catch(() => ({}));
    const response = await backendRequest(
      `/api/v1/integrations/${systemType}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      request
    );

    if (!response.ok) {
      return handleBackendError(response);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return internalErrorResponse(error);
  }
}

// PATCH /api/integrations/[systemType] - Update integration config
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ systemType: string }> }
) {
  try {
    const { systemType } = await params;
    const body = await request.json().catch(() => ({}));
    const response = await backendRequest(
      `/api/v1/integrations/${systemType}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
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

// DELETE /api/integrations/[systemType] - Delete integration config
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ systemType: string }> }
) {
  try {
    const { systemType } = await params;
    const response = await backendRequest(
      `/api/v1/integrations/${systemType}`,
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
