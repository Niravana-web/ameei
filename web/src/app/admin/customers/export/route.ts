import { isAdmin } from "@/lib/auth";
import { getPeople, peopleToCsv } from "@/lib/people";

export const dynamic = "force-dynamic";

/** CSV of buyers and subscribers. Admin only; the layout gate does not cover route handlers. */
export async function GET() {
  if (!(await isAdmin())) {
    return new Response("Forbidden", { status: 403 });
  }
  const csv = peopleToCsv(await getPeople());
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ameei-people-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
