import type { ReactNode } from "react";

/* Dense admin primitives. 13px base, hairline borders, no shadows. */

export const btn =
  "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[9px] border border-ink/15 bg-white px-3 font-body text-[12.5px] font-medium text-ink transition-colors hover:border-crimson/50 disabled:cursor-not-allowed disabled:opacity-50";
export const btnPrimary =
  "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[9px] border border-crimson bg-crimson px-3 font-body text-[12.5px] font-semibold text-white transition-colors hover:bg-crimson-deep disabled:cursor-not-allowed disabled:opacity-50";
export const btnOk =
  "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[9px] border border-[#1F6B44] bg-[#1F6B44] px-3 font-body text-[12.5px] font-semibold text-white transition-colors hover:bg-[#185536]";
export const input =
  "h-[30px] rounded-lg border border-ink/15 bg-white px-2.5 font-body text-[12.5px] text-ink placeholder:text-ash/70 focus:border-crimson focus:outline-none";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[14px] border border-ink/[0.08] bg-white ${className}`}>{children}</div>
  );
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8E7F81] ${className}`}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-1.5 p-4">
      <Label>{label}</Label>
      <span className="font-body text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
        {value}
      </span>
      {sub && <span className="font-body text-xs text-ash">{sub}</span>}
    </Card>
  );
}

export type Tone = "up" | "warn" | "hot" | "muted" | "blue";
const tones: Record<Tone, string> = {
  up: "bg-[#E3F3E9] text-[#1F6B44]",
  warn: "bg-[#FDF0D4] text-[#8A5A00]",
  hot: "bg-[#FFE4E6] text-[#9F1239]",
  muted: "bg-[#F0EBE6] text-ash",
  blue: "bg-[#E6EEF8] text-[#1E4D8C]",
};

export function Pill({
  tone = "muted",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-px font-body text-[11px] font-semibold leading-[1.5] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  if (status === "shipped") return "up";
  if (status === "roasting") return "hot";
  if (status === "paid") return "warn";
  return "muted";
}

export function statusLabel(status: string): string {
  if (status === "paid") return "To roast";
  if (status === "pending") return "Abandoned";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function heatTone(label: string | null | undefined): Tone {
  if (!label) return "muted";
  if (/extra/i.test(label)) return "hot";
  if (/medium/i.test(label)) return "warn";
  return "muted";
}

export function PageHeader({
  title,
  sub,
  actions,
}: {
  title: string;
  sub?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-body text-[22px] font-bold tracking-[-0.02em] text-ink">{title}</h1>
        {sub && <p className="mt-0.5 font-body text-xs text-ash">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Table header cell. */
export function Th({ children, right = false }: { children?: ReactNode; right?: boolean }) {
  return (
    <th
      className={`whitespace-nowrap border-b border-ink/[0.08] bg-[#FBF8F4] px-3 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8E7F81] ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  right = false,
  className = "",
}: {
  children?: ReactNode;
  right?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`border-b border-ink/[0.06] px-3 py-2.5 align-middle font-body text-[13px] text-ink ${
        right ? "text-right" : ""
      } ${className}`}
    >
      {children}
    </td>
  );
}
