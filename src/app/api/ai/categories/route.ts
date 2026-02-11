import { createProxyGET } from "../../utils";

// GET /api/ai/categories - Get document categories
export const GET = createProxyGET("/api/v1/ai/categories");
