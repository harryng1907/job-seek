import type { ReactNode } from "react";
import { PRIORITY_META, STATUS_META } from "@/lib/job-meta";
import type { ApplicationStatus } from "@/types/application";
import type { Priority } from "@/types/job";

const BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] text-[11px] leading-none font-medium whitespace-nowrap";

export function Badge({
  children,
  className = "border-line bg-surface-2 text-muted",
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span className={`${BASE} ${className}`} title={title}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge className={meta.className}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  return <Badge className={meta.className}>{meta.label}</Badge>;
}

/** Neutral chip used for the metadata row on a job card. */
export function MetaChip({
  icon,
  children,
  className = "text-muted",
  title,
}: {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs whitespace-nowrap ${className}`}
      title={title}
    >
      {icon}
      {children}
    </span>
  );
}
