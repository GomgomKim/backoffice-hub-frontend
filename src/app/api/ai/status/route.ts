import { createProxyGET } from "../../utils";

// GET /api/ai/status - Get AI service status
export const GET = createProxyGET("/api/v1/ai/status");
