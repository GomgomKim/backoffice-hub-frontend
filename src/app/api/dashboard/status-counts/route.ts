import { createProxyGET } from "../../utils";

// GET /api/dashboard/status-counts
export const GET = createProxyGET("/api/v1/dashboard/status-counts");
