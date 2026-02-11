import { createProxyPOST } from "../../utils";

// POST /api/ai/anomaly - Detect anomalies
export const POST = createProxyPOST("/api/v1/ai/anomaly");
