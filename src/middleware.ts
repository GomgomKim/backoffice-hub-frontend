import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (인증 불필요)
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/api/webhooks(.*)",
]);

// Protected routes (인증 필요)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/deadlines(.*)",
  "/documents(.*)",
  "/payroll(.*)",
  "/expenses(.*)",
  "/tax(.*)",
  "/reports(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
