import { createProxyPOST } from "../../../utils";

// POST /api/ai/categories/suggest - Suggest categories for a deadline
export const POST = createProxyPOST("/api/v1/ai/categories/suggest");
