import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/AdminNav";

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
      <div className="mx-auto max-w-lg px-6 pb-16 pt-32 text-center">
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

  const openOrders = await prisma.order.count({ where: { status: { in: ["paid", "roasting"] } } });
  const name = user.firstName ?? user.username ?? "Admin";

  return (
    <div className="flex min-h-screen flex-wrap gap-4 bg-[#F6F2EC] p-4 font-body text-[13px] leading-[1.45] text-ink">
      <aside className="flex w-full flex-col gap-1 self-start rounded-2xl border border-ink/[0.08] bg-white p-3.5 md:w-60 md:flex-none">
        <div className="flex items-center gap-2.5 px-2.5 pb-2.5 pt-1.5">
          <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-crimson font-display text-base font-black text-chalk">
            æ
          </span>
          <span className="flex flex-col leading-[1.15]">
            <span className="font-display text-[17px] font-black tracking-tight text-crimson">ameei</span>
            <span className="text-[11px] text-[#8E7F81]">Admin</span>
          </span>
        </div>
        <AdminNav openOrders={openOrders} />
        <div className="mt-1.5 flex items-center gap-2.5 border-t border-ink/[0.08] px-2.5 pt-3">
          <UserButton />
          <span className="flex flex-col leading-tight">
            <span className="font-semibold">{name}</span>
            <span className="text-[11px] text-[#8E7F81]">admin</span>
          </span>
        </div>
      </aside>
      <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">{children}</main>
    </div>
  );
}
