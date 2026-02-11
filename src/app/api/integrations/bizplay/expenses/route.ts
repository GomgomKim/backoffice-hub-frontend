import { createProxyGET } from "../../../../utils";

// GET /api/integrations/bizplay/expenses - Get Bizplay expenses
export const GET = createProxyGET("/api/v1/integrations/bizplay/expenses");
