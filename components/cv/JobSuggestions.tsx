"use client";

import { useState } from "react";
import { Check, Copy, Lightbulb, Sparkles } from "lucide-react";
import type { TrackedJob } from "@/types/application";

/**
 * Pipeline suggestions for the linked job.
 *
 * Everything here is advisory: nothing is written into the configuration unless
 * the user presses a button, and every applied suggestion stays editable
 * afterwards.
 */
export function JobSuggestions({
  job,
  onUseSummary,
}: {
  job: TrackedJob;
  onUseSummary: (summary: string) => void;
}) {
  const [copied, setCopied] = useState<number | null>(null);
  const [usedSummary, setUsedSummary] = useState(false);

  // The user's own tailored summary beats the generated one when it exists.
  const suggestedSummary = job.state.tailoredSummary.trim() || job.suggestedTailoredSummary;

  const copy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard permission denied — the text is still on screen to select.
    }
  };

  return (
    <div className="border-accent/20 bg-accent/[0.04] space-y-4 rounded-xl border p-4">
      <div className="flex items-start gap-2">
        <Sparkles className="text-accent mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div>
          <p className="text-ink text-sm font-medium">
            Suggestions for {job.company}
          </p>
          <p className="text-faint mt-0.5 text-[11px]">
            Loaded from the job pipeline. Nothing is applied until you choose it.
          </p>
        </div>
      </div>

      <div>
        <p className="text-faint mb-1.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
          <Lightbulb className="h-3 w-3" />
          CV strategy
        </p>
        <p className="text-muted text-sm leading-relaxed">{job.cvStrategy}</p>
      </div>

      {job.state.cvTweaks.trim() ? (
        <div>
          <p className="text-faint mb-1.5 text-[11px] font-medium tracking-wide uppercase">
            Your notes from the job detail
          </p>
          <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
            {job.state.cvTweaks}
          </p>
        </div>
      ) : null}

      {suggestedSummary ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <p className="text-faint text-[11px] font-medium tracking-wide uppercase">
              Tailored summary
            </p>
            <button
              type="button"
              onClick={() => {
                onUseSummary(suggestedSummary);
                setUsedSummary(true);
                window.setTimeout(() => setUsedSummary(false), 1500);
              }}
              className="text-accent hover:text-ink text-[11px] transition-colors"
            >
              {usedSummary ? "Applied — edit below" : "Use as summary"}
            </button>
          </div>
          <p className="text-muted text-sm leading-relaxed">{suggestedSummary}</p>
        </div>
      ) : null}

      {job.suggestedCvBullets.length ? (
        <div>
          <p className="text-faint mb-1.5 text-[11px] font-medium tracking-wide uppercase">
            Suggested bullet edits
          </p>
          <ul className="space-y-1.5">
            {job.suggestedCvBullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-accent/50 mt-[7px] h-1 w-1 shrink-0 rounded-full" />
                <span className="text-muted flex-1 text-sm leading-relaxed">{bullet}</span>
                <button
                  type="button"
                  onClick={() => copy(bullet, index)}
                  aria-label="Copy bullet"
                  className="text-faint hover:text-ink mt-0.5 shrink-0 transition-colors"
                >
                  {copied === index ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <p className="text-faint mt-2 text-[11px]">
            Paste into any bullet below, or ignore them entirely.
          </p>
        </div>
      ) : null}
    </div>
  );
}
