"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

/** Read-only block in the job detail view. */
export function Section({
  title,
  icon,
  hint,
  children,
}: {
  title: string;
  icon?: ReactNode;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-line border-t pt-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-ink flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </h3>
        {hint ? <span className="text-faint text-[11px]">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

/** Simple bulleted list used across the detail view. */
export function BulletList({
  items,
  marker = "bg-line-strong",
  empty = "Nothing recorded yet.",
}: {
  items: string[];
  marker?: string;
  empty?: string;
}) {
  if (!items.length) {
    return <p className="text-faint text-sm">{empty}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-muted flex gap-2.5 text-sm leading-relaxed">
          <span className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${marker}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A section the user writes into.
 *
 * The pipeline's suggestion is shown alongside but never inside the field —
 * user text is stored separately, so a data refresh can update the suggestion
 * without touching anything that has been written.
 */
export function EditableSection({
  title,
  icon,
  hint,
  suggestion,
  suggestionLabel = "Suggested starting point",
  value,
  onChange,
  placeholder,
  rows = 4,
  children,
}: {
  title: string;
  icon?: ReactNode;
  hint?: string;
  suggestion?: string;
  suggestionLabel?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  children?: ReactNode;
}) {
  return (
    <Section title={title} icon={icon} hint={hint}>
      {children}

      {suggestion ? (
        <div className="border-line bg-surface-2/60 mb-3 rounded-lg border p-3">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-faint flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
              <Sparkles className="h-3 w-3" />
              {suggestionLabel}
            </span>
            <button
              type="button"
              onClick={() => onChange(value ? `${value.trim()}\n\n${suggestion}` : suggestion)}
              className="text-faint hover:text-ink rounded px-1.5 py-0.5 text-[11px] transition-colors"
            >
              Copy into my draft
            </button>
          </div>
          <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
            {suggestion}
          </p>
        </div>
      ) : null}

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border-line bg-canvas text-ink placeholder:text-faint focus:border-line-strong w-full resize-y rounded-lg border p-3 text-sm leading-relaxed transition-colors outline-none"
      />
    </Section>
  );
}
