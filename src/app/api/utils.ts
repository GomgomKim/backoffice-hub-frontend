import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const FALLBACK_JWT_TOKEN = process.env.HARDCODED_JWT_TOKEN || "";

export const getApiConfig = async (request?: NextRequest) => {
  const apiUrl = process.env.BACKOFFICE_API_URL || "http://localhost:5000";

  let authToken = `Bearer ${FALLBACK_JWT_TOKEN}`;

  // 1. First check Authorization header from client
  const clientAuthHeader = request?.headers.get("authorization");
  let isValidClientToken = false;

  if (clientAuthHeader && clientAuthHeader.startsWith("Bearer ")) {
    const clientToken = clientAuthHeader.split(" ")[1];
    if (clientToken && clientToken.split(".").length === 3) {
      authToken = clientAuthHeader;
      isValidClientToken = true;
    }
  }

  // 2. If no valid client token, try Clerk server-side
  if (!clientAuthHeader || !isValidClientToken) {
    const { getToken } = await auth();

    if (getToken) {
      try {
        const token = await getToken();
        if (token) {
          authToken = `Bearer ${token}`;
        }
      } catch {
        // Clerk token unavailable, fallback token will be used
      }
    }
  }

  return {
    apiUrl,
    authToken,
  };
};

export const createApiHeaders = (authToken?: string | null) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = authToken;
  }

  return headers;
};

export const backendRequest = async (
  endpoint: string,
  options: RequestInit = {},
  request?: NextRequest
) => {
  const { apiUrl, authToken } = await getApiConfig(request);

  const defaultHeaders = createApiHeaders(authToken);
  const mergedHeaders = {
    ...defaultHeaders,
    ...options.headers,
  };

  return fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: mergedHeaders,
  });
};

/**
 * Standard API error response
 */
export function apiErrorResponse(
  message: string,
  status: number,
  details?: unknown
): NextResponse {
  return NextResponse.json({ error: message, status, details }, { status });
}

/**
 * Handle backend error response
 */
export async function handleBackendError(response: Response): Promise<NextResponse> {
  const errorData = await response.json().catch(() => ({}));

  return apiErrorResponse(
    `API request failed: ${response.status} ${response.statusText}`,
    response.status,
    errorData
  );
}

/**
 * 500 Internal Server Error response
 */
export function internalErrorResponse(error: unknown): NextResponse {
  return apiErrorResponse(
    "Internal server error",
    500,
    error instanceof Error ? error.message : "Unknown error"
  );
}

/**
 * Create a simple GET proxy handler
 */
export function createProxyGET(endpoint: string) {
  return async (request: NextRequest) => {
    try {
      // Forward query params
      const url = new URL(request.url);
      const queryString = url.searchParams.toString();
      const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await backendRequest(
        fullEndpoint,
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
  };
}

/**
 * Create a simple POST proxy handler
 */
export function createProxyPOST(endpoint: string) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json().catch(() => ({}));
      const response = await backendRequest(
        endpoint,
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
      return NextResponse.json(data);
    } catch (error) {
      return internalErrorResponse(error);
    }
  };
}

/**
 * Create a simple PATCH proxy handler
 */
export function createProxyPATCH(endpoint: string) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json().catch(() => ({}));
      const response = await backendRequest(
        endpoint,
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
  };
}

/**
 * Create a simple DELETE proxy handler
 */
export function createProxyDELETE(endpoint: string) {
  return async (request: NextRequest) => {
    try {
      const response = await backendRequest(
        endpoint,
        { method: "DELETE" },
        request
      );

      if (!response.ok) {
        return handleBackendError(response);
      }

      // DELETE might return 204 No Content
      if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return internalErrorResponse(error);
    }
  };
}
