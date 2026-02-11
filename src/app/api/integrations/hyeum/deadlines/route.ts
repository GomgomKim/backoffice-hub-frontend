import { createProxyGET } from "../../../../utils";

// GET /api/integrations/hyeum/deadlines - Get Hyeum upcoming deadlines
export const GET = createProxyGET("/api/v1/integrations/hyeum/deadlines");
