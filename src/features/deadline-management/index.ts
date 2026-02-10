// API
export { deadlineService } from "./api/deadlineService";
export type {
  CreateDeadlinePayload,
  UpdateDeadlinePayload,
  DeadlineFilters,
  DeadlineTypeResponse,
} from "./api/deadlineService";

// Hooks
export {
  useDeadlines,
  useDeadline,
  useCalendarDeadlines,
  useUpcomingDeadlines,
  useDeadlineTypes,
  useCreateDeadline,
  useUpdateDeadline,
  useDeleteDeadline,
  useCompleteDeadline,
} from "./hooks/useDeadlines";

// Components
export { DeadlineFormModal } from "./ui/DeadlineFormModal";
export { DeadlineDetailPanel } from "./ui/DeadlineDetailPanel";
export { DDayBadge } from "./ui/DDayBadge";
export { DeadlineFilter } from "./ui/DeadlineFilter";
