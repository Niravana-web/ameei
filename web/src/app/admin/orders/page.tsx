import { redirect } from "next/navigation";

/** The flat order list became the roasting queue. */
export default function AdminOrdersPage() {
  redirect("/admin/queue");
}
