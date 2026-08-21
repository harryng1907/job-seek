import { CHANCE_META, fitScoreTone } from "@/lib/job-meta";
import type { Chance } from "@/types/job";

/**
 * Fit score out of 10, drawn as a number plus a 10-segment meter so a card can
 * be scanned without reading the digits.
 */
export function FitScore({
  score,
  chance,
  size = "sm",
  label,
  title,
}: {
  score: number;
  chance?: Chance;
  size?: "sm" | "lg";
  /** What the score measures on this track, e.g. "Career fit". */
  label?: string;
  title?: string;
}) {
  const tone = fitScoreTone(score);
  const segments = Array.from({ length: 10 }, (_, i) => i < score);

  return (
    <div className="flex flex-col items-end gap-1.5" title={title}>
      {label ? (
        <span className="text-faint text-[10px] leading-none tracking-wide uppercase">
          {label}
        </span>
      ) : null}
      <div className="flex items-baseline gap-1">
        <span
          className={`font-semibold tabular-nums ${tone.text} ${
            size === "lg" ? "text-2xl" : "text-sm"
          }`}
        >
          {score}
        </span>
        <span className={`text-faint ${size === "lg" ? "text-sm" : "text-[11px]"}`}>
          /10
        </span>
      </div>
      <div className="flex gap-[2px]" aria-label={`Fit score ${score} out of 10`}>
        {segments.map((filled, i) => (
          <span
            key={i}
            className={`h-1 rounded-full ${size === "lg" ? "w-2.5" : "w-1.5"} ${
              filled ? tone.bar : "bg-line-strong"
            }`}
          />
        ))}
      </div>
      {chance ? (
        <span className={`text-[11px] leading-none ${CHANCE_META[chance].className}`}>
          {CHANCE_META[chance].label}
        </span>
      ) : null}
    </div>
  );
}
