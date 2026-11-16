"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, syncOrderFromStripe, type OrderStatus } from "@/lib/orders";

const ADMIN_PATHS = ["/admin", "/admin/queue", "/admin/customers"];
function refresh() {
  for (const p of ADMIN_PATHS) revalidatePath(p);
}

const idSchema = z.string().min(1).max(64);

/** Move an order along the board. Timestamps follow the status. */
export async function setOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  const id = idSchema.parse(orderId);
  if (!ORDER_STATUSES.includes(status)) throw new Error("Unknown status.");
  const now = new Date();
  await prisma.order.update({
    where: { id },
    data: {
      status,
      ...(status === "roasting" ? { roastedAt: now } : {}),
      ...(status === "shipped" ? { shippedAt: now } : {}),
      // Going backwards clears the later timestamps so the board stays honest.
      ...(status === "paid" ? { roastedAt: null, shippedAt: null } : {}),
    },
  });
  refresh();
}

const shipSchema = z.object({
  orderId: idSchema,
  carrier: z.string().trim().max(32),
  trackingNumber: z.string().trim().max(64),
});

/** Mark shipped with the carrier and tracking number from the card's form. */
export async function shipOrder(formData: FormData) {
  await requireAdmin();
  const data = shipSchema.parse({
    orderId: formData.get("orderId"),
    carrier: formData.get("carrier") ?? "",
    trackingNumber: formData.get("trackingNumber") ?? "",
  });
  await prisma.order.update({
    where: { id: data.orderId },
    data: {
      status: "shipped",
      shippedAt: new Date(),
      carrier: data.carrier || null,
      trackingNumber: data.trackingNumber || null,
    },
  });
  refresh();
}

const notesSchema = z.object({ orderId: idSchema, notes: z.string().max(2000) });

export async function saveOrderNotes(formData: FormData) {
  await requireAdmin();
  const data = notesSchema.parse({
    orderId: formData.get("orderId"),
    notes: String(formData.get("notes") ?? ""),
  });
  await prisma.order.update({
    where: { id: data.orderId },
    data: { notes: data.notes.trim() || null },
  });
  refresh();
}

/** Pull name, address, phone and payment link from Stripe for an older order. */
export async function syncOrder(orderId: string) {
  await requireAdmin();
  await syncOrderFromStripe(idSchema.parse(orderId));
  refresh();
}
