import { httpClient } from "@/shared/api/core/httpClient";
import type {
  Document,
  DocumentChecklist,
  DocumentStats,
  DocumentCategory,
  DocumentStatus,
} from "@/shared/types";

// API Types
export interface DocumentListParams {
  category?: DocumentCategory;
  status?: DocumentStatus;
  deadline_id?: number;
  limit?: number;
  offset?: number;
}

export interface DocumentCreatePayload {
  title: string;
  category?: DocumentCategory;
  deadline_id?: number;
  expires_at?: string;
}

export interface DocumentUpdatePayload {
  title?: string;
  category?: DocumentCategory;
  expires_at?: string;
}

export interface ChecklistItemTogglePayload {
  is_completed: boolean;
}

export interface ChecklistUpdatePayload {
  items: Array<{
    id: string;
    title: string;
    is_completed: boolean;
    is_required: boolean;
    document_id?: number | null;
  }>;
}

// Document API
export const documentService = {
  // List documents
  list: async (params?: DocumentListParams): Promise<Document[]> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.deadline_id)
      searchParams.append("deadline_id", String(params.deadline_id));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.offset) searchParams.append("offset", String(params.offset));

    const query = searchParams.toString();
    const url = query ? `/api/v1/documents?${query}` : "/api/v1/documents";
    return httpClient.get<Document[]>(url);
  },

  // Get single document
  get: async (id: string | number): Promise<Document> => {
    return httpClient.get<Document>(`/api/v1/documents/${id}`);
  },

  // Create document (without file)
  create: async (payload: DocumentCreatePayload): Promise<Document> => {
    return httpClient.post<Document>("/api/v1/documents", payload);
  },

  // Update document
  update: async (
    id: string | number,
    payload: DocumentUpdatePayload
  ): Promise<Document> => {
    return httpClient.patch<Document>(`/api/v1/documents/${id}`, payload);
  },

  // Delete document
  delete: async (id: string | number): Promise<void> => {
    return httpClient.delete<void>(`/api/v1/documents/${id}`);
  },

  // Upload document with file
  upload: async (
    file: File,
    metadata: {
      title?: string;
      category?: DocumentCategory;
      deadline_id?: number;
      expires_at?: string;
    }
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata.title) formData.append("title", metadata.title);
    if (metadata.category) formData.append("category", metadata.category);
    if (metadata.deadline_id)
      formData.append("deadline_id", String(metadata.deadline_id));
    if (metadata.expires_at) formData.append("expires_at", metadata.expires_at);

    return httpClient.post<Document>("/api/v1/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Download document
  getDownloadUrl: (id: string | number): string => {
    return `/api/v1/documents/${id}/download`;
  },

  // Verify document
  verify: async (id: string | number): Promise<Document> => {
    return httpClient.patch<Document>(`/api/v1/documents/${id}/verify`, {});
  },

  // Reject document
  reject: async (id: string | number): Promise<Document> => {
    return httpClient.patch<Document>(`/api/v1/documents/${id}/reject`, {});
  },

  // Get document statistics
  stats: async (): Promise<DocumentStats> => {
    return httpClient.get<DocumentStats>("/api/v1/documents/stats");
  },

  // Get expiring documents
  expiring: async (days: number = 30): Promise<Document[]> => {
    return httpClient.get<Document[]>(
      `/api/v1/documents/expiring?days=${days}`
    );
  },
};

// Checklist API
export const checklistService = {
  // Get checklist for a deadline
  get: async (deadlineId: number): Promise<DocumentChecklist> => {
    return httpClient.get<DocumentChecklist>(
      `/api/v1/documents/deadlines/${deadlineId}/checklist`
    );
  },

  // Update entire checklist
  update: async (
    deadlineId: number,
    payload: ChecklistUpdatePayload
  ): Promise<DocumentChecklist> => {
    return httpClient.put<DocumentChecklist>(
      `/api/v1/documents/deadlines/${deadlineId}/checklist`,
      payload
    );
  },

  // Toggle single checklist item
  toggleItem: async (
    deadlineId: number,
    itemId: string,
    isCompleted: boolean
  ): Promise<DocumentChecklist> => {
    return httpClient.patch<DocumentChecklist>(
      `/api/v1/documents/deadlines/${deadlineId}/checklist/items/${itemId}/toggle`,
      { is_completed: isCompleted }
    );
  },

  // Link document to checklist item
  linkDocument: async (
    deadlineId: number,
    itemId: string,
    documentId: number
  ): Promise<DocumentChecklist> => {
    return httpClient.patch<DocumentChecklist>(
      `/api/v1/documents/deadlines/${deadlineId}/checklist/items/${itemId}/link`,
      { document_id: documentId }
    );
  },
};
