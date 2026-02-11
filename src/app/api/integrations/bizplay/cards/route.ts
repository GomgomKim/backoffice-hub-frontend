import { createProxyGET } from "../../../../utils";

// GET /api/integrations/bizplay/cards - Get Bizplay corporate cards
export const GET = createProxyGET("/api/v1/integrations/bizplay/cards");
