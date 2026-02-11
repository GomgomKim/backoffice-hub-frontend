// Types
export * from "./types";

// API
export { aiService } from "./api/aiService";

// Hooks
export {
  AI_KEYS,
  useAIStatus,
  useDocumentCategories,
  useClassifyDocument,
  useClassifyDocumentsBatch,
  useSuggestCategories,
  useGenerateReport,
  useDetectAnomalies,
  useAIAssist,
} from "./hooks/useAI";

// UI Components
export { AIAssistantWidget } from "./ui/AIAssistantWidget";
export { DocumentClassifyModal } from "./ui/DocumentClassifyModal";
export { AnomalyAlertCard } from "./ui/AnomalyAlertCard";
