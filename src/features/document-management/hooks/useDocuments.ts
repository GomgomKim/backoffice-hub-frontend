import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  documentService,
  checklistService,
  type DocumentListParams,
  type DocumentCreatePayload,
  type DocumentUpdatePayload,
  type ChecklistUpdatePayload,
} from "../api/documentService";
import type { Document, DocumentChecklist, DocumentCategory } from "@/shared/types";

// Query Keys
export const DOCUMENT_KEYS = {
  all: ["documents"] as const,
  lists: () => [...DOCUMENT_KEYS.all, "list"] as const,
  list: (params?: DocumentListParams) =>
    [...DOCUMENT_KEYS.lists(), params] as const,
  details: () => [...DOCUMENT_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...DOCUMENT_KEYS.details(), id] as const,
  stats: () => [...DOCUMENT_KEYS.all, "stats"] as const,
  expiring: (days: number) => [...DOCUMENT_KEYS.all, "expiring", days] as const,
  checklists: () => [...DOCUMENT_KEYS.all, "checklists"] as const,
  checklist: (deadlineId: number) =>
    [...DOCUMENT_KEYS.checklists(), deadlineId] as const,
};

// Document List
export function useDocuments(params?: DocumentListParams) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.list(params),
    queryFn: () => documentService.list(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Document by Deadline
export function useDocumentsByDeadline(deadlineId: number) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.list({ deadline_id: deadlineId }),
    queryFn: () => documentService.list({ deadline_id: deadlineId }),
    staleTime: 5 * 60 * 1000,
    enabled: !!deadlineId,
  });
}

// Single Document
export function useDocument(id: string | number) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.detail(id),
    queryFn: () => documentService.get(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// Document Stats
export function useDocumentStats() {
  return useQuery({
    queryKey: DOCUMENT_KEYS.stats(),
    queryFn: () => documentService.stats(),
    staleTime: 5 * 60 * 1000,
  });
}

// Expiring Documents
export function useExpiringDocuments(days: number = 30) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.expiring(days),
    queryFn: () => documentService.expiring(days),
    staleTime: 5 * 60 * 1000,
  });
}

// Create Document
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DocumentCreatePayload) =>
      documentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.stats() });
    },
  });
}

// Upload Document
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      metadata,
    }: {
      file: File;
      metadata: {
        title?: string;
        category?: DocumentCategory;
        deadline_id?: number;
        expires_at?: string;
      };
    }) => documentService.upload(file, metadata),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.stats() });
      if (variables.metadata.deadline_id) {
        queryClient.invalidateQueries({
          queryKey: DOCUMENT_KEYS.checklist(variables.metadata.deadline_id),
        });
      }
    },
  });
}

// Update Document
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: DocumentUpdatePayload;
    }) => documentService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.detail(variables.id),
      });
    },
  });
}

// Delete Document
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => documentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.stats() });
    },
  });
}

// Verify Document
export function useVerifyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => documentService.verify(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.stats() });
    },
  });
}

// Reject Document
export function useRejectDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => documentService.reject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.stats() });
    },
  });
}

// Checklist Hooks
export function useChecklist(deadlineId: number) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.checklist(deadlineId),
    queryFn: () => checklistService.get(deadlineId),
    staleTime: 5 * 60 * 1000,
    enabled: !!deadlineId,
  });
}

export function useUpdateChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deadlineId,
      payload,
    }: {
      deadlineId: number;
      payload: ChecklistUpdatePayload;
    }) => checklistService.update(deadlineId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.checklist(variables.deadlineId),
      });
    },
  });
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deadlineId,
      itemId,
      isCompleted,
    }: {
      deadlineId: number;
      itemId: string;
      isCompleted: boolean;
    }) => checklistService.toggleItem(deadlineId, itemId, isCompleted),
    onMutate: async ({ deadlineId, itemId, isCompleted }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: DOCUMENT_KEYS.checklist(deadlineId),
      });

      // Snapshot previous value
      const previous = queryClient.getQueryData<DocumentChecklist>(
        DOCUMENT_KEYS.checklist(deadlineId)
      );

      // Optimistically update
      if (previous) {
        const updatedItems = previous.items.map((item) =>
          item.id === itemId ? { ...item, isCompleted } : item
        );
        const completed = updatedItems.filter((i) => i.isCompleted).length;
        const total = updatedItems.length;

        queryClient.setQueryData(DOCUMENT_KEYS.checklist(deadlineId), {
          ...previous,
          items: updatedItems,
          completionRate: total > 0 ? (completed / total) * 100 : 0,
        });
      }

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          DOCUMENT_KEYS.checklist(variables.deadlineId),
          context.previous
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.checklist(variables.deadlineId),
      });
    },
  });
}

export function useLinkDocumentToChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deadlineId,
      itemId,
      documentId,
    }: {
      deadlineId: number;
      itemId: string;
      documentId: number;
    }) => checklistService.linkDocument(deadlineId, itemId, documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.checklist(variables.deadlineId),
      });
    },
  });
}
