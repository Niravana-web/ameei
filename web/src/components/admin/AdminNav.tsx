"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const kitchen = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/queue", label: "Roasting queue", icon: "list" },
  { href: "/admin/customers", label: "Customers", icon: "people" },
] as const;

const store = [{ href: "/admin/products", label: "Pouch listing", icon: "bag" }] as const;

function Icon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h10M4 18h7" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-5-6.3" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 8h12l-1 12H7L6 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </svg>
      );
  }
}

function NavLink({
  href,
  label,
  icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 font-body text-[13px] transition-colors ${
        active
          ? "bg-[#FFF1EC] font-semibold text-crimson-deep"
          : "font-medium text-[#4A3A3C] hover:bg-[#F6F2EC] hover:text-ink"
      }`}
    >
      <Icon name={icon} />
      {label}
      {badge ? (
        <span className="ml-auto rounded-full bg-[#FFE4E6] px-2 py-px text-[11px] font-semibold text-[#9F1239]">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AdminNav({ openOrders }: { openOrders: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const heading = "px-2.5 pb-1 pt-3 font-body text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8E7F81]";

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      <span className={heading}>Kitchen</span>
      {kitchen.map((n) => (
        <NavLink
          key={n.href}
          {...n}
          active={isActive(n.href)}
          badge={n.href === "/admin/queue" ? openOrders : undefined}
        />
      ))}
      <span className={heading}>Store</span>
      {store.map((n) => (
        <NavLink key={n.href} {...n} active={isActive(n.href)} />
      ))}
      <div className="mx-1 my-2 h-px bg-ink/[0.08]" />
      <NavLink href="/" label="View site" icon="ext" active={false} />
    </nav>
  );
}
