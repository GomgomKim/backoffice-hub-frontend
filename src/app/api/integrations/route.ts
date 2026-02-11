import { createProxyGET } from "../utils";

// GET /api/integrations - Get all integrations
export const GET = createProxyGET("/api/v1/integrations");
