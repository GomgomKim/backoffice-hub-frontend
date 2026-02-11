import { createProxyPOST } from "../../../utils";

// POST /api/ai/classify/batch - Classify multiple documents
export const POST = createProxyPOST("/api/v1/ai/classify/batch");
