// API
export { documentService, checklistService } from "./api/documentService";
export type {
  DocumentListParams,
  DocumentCreatePayload,
  DocumentUpdatePayload,
  ChecklistUpdatePayload,
} from "./api/documentService";

// Hooks
export {
  useDocuments,
  useDocument,
  useDocumentsByDeadline,
  useDocumentStats,
  useExpiringDocuments,
  useCreateDocument,
  useUploadDocument,
  useUpdateDocument,
  useDeleteDocument,
  useVerifyDocument,
  useRejectDocument,
  useChecklist,
  useUpdateChecklist,
  useToggleChecklistItem,
  useLinkDocumentToChecklistItem,
  DOCUMENT_KEYS,
} from "./hooks/useDocuments";

// UI Components
export { DocumentUploadModal } from "./ui/DocumentUploadModal";
export { ChecklistWidget } from "./ui/ChecklistWidget";
export { DocumentCard } from "./ui/DocumentCard";
export { DocumentFilter, type DocumentFilterValues } from "./ui/DocumentFilter";
