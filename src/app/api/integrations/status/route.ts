import { createProxyGET } from "../../utils";

// GET /api/integrations/status - Get all integration statuses
export const GET = createProxyGET("/api/v1/integrations/status");
