import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Next.js 16 renamed `middleware` → `proxy`. Clerk's clerkMiddleware is the handler.
const isProtected = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Require sign-in for /admin/*. The admin role check (publicMetadata.role === "admin")
  // happens in app/admin/layout.tsx, which can read full user metadata server-side.
  if (isProtected(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next internals and static assets; run on everything else + API routes.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
