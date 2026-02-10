import { createProxyGET } from "../../../utils";

// GET /api/notifications/unread/count
export const GET = createProxyGET("/api/v1/notifications/unread/count");
