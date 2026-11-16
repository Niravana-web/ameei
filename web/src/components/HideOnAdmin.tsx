"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The storefront header and footer stay off the admin, which has its own shell. */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
