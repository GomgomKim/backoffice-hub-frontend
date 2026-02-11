import { createProxyPOST } from "../../utils";

// POST /api/ai/classify - Classify a document
export const POST = createProxyPOST("/api/v1/ai/classify");
