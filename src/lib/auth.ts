import { currentUser } from "@clerk/nextjs/server";

// Admin = Clerk publicMetadata.role === "admin" (set in the Clerk Dashboard).
// Shared by the admin server actions and the upload route.
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  return (user?.publicMetadata as { role?: string })?.role === "admin";
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Forbidden: admin role required.");
}
