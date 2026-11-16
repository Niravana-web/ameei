import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The admin gate. Middleware (proxy.ts) already requires sign-in for /admin/*;
// here we enforce the role. publicMetadata.role is set per-user in the Clerk Dashboard
// (Users → ⋯ → Edit public metadata → {"role":"admin"}).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = (user.publicMetadata as { role?: string })?.role;
  if (role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-6 pt-32 pb-16 text-center">
        <h1 className="font-display text-headline-lg text-crimson">Not authorized</h1>
        <p className="mt-3 font-body text-body-md text-ash">
          This area is for ameei administrators. Your account doesn&apos;t have the{" "}
          <code className="rounded bg-chalk px-1.5 py-0.5">admin</code> role.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-crimson px-6 py-2.5 font-body text-label-caps uppercase text-white"
        >
          Back to site
        </Link>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Products" },
    { href: "/admin/products/new", label: "Add product" },
    { href: "/admin/orders", label: "Orders" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:px-6">
      <div className="mb-8 flex items-center justify-between border-b border-ink/10 pb-4">
        <div className="flex items-center gap-6">
          <span className="font-display text-headline-md font-black italic text-crimson">
            ameei admin
          </span>
          <nav className="hidden items-center gap-4 md:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="font-body text-body-sm uppercase tracking-wide text-ink/60 transition-colors hover:text-crimson"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="font-body text-body-sm text-ink/60 hover:text-crimson">
            View site ↗
          </Link>
          <UserButton />
        </div>
      </div>
      {children}
    </div>
  );
}
