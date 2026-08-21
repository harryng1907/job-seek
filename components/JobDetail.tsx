"use client";

import { useEffect } from "react";
import {
  Banknote,
  Briefcase,
  CalendarClock,
  ExternalLink,
  FileText,
  GraduationCap,
  History,
  ListChecks,
  Mail,
  MapPin,
  MessageSquareQuote,
  Mic,
  Minus,
  PenLine,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkle,
  StickyNote,
  Target,
  TimerReset,
  UserRoundPen,
  X,
} from "lucide-react";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { FitScore } from "@/components/ui/FitScore";
import { BulletList, EditableSection, Section } from "@/components/ui/Section";
import { StatusStepper } from "@/components/StatusControls";
import { describeDeadline, formatDate, formatSalary } from "@/lib/format";
import { ELIGIBILITY_META, STATUS_META, blockerReason, isIneligible } from "@/lib/job-meta";
import type {
  ApplicationState,
  ApplicationStatus,
  TrackedJob,
} from "@/types/application";
import type { Eligibility } from "@/types/job";

function EligibilityCard({
  title,
  icon,
  eligibility,
}: {
  title: string;
  icon: React.ReactNode;
  eligibility: Eligibility;
}) {
  const hardBlocker = eligibility.level === "blocked" && eligibility.hardRequirement;

  return (
    <div
      className={`rounded-lg border p-3 ${
        hardBlocker
          ? "border-rose-500/30 bg-rose-500/[0.06]"
          : "border-line bg-surface-2/60"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted flex items-center gap-1.5 text-xs font-medium">
          {icon}
          {title}
        </span>
        <span className={`text-xs ${ELIGIBILITY_META[eligibility.level].className}`}>
          {ELIGIBILITY_META[eligibility.level].label}
        </span>
      </div>
      <p className="text-muted mt-2 text-sm leading-relaxed">{eligibility.note}</p>
      <p className="text-faint mt-2 text-[11px]">
        {hardBlocker
          ? "Hard requirement — this rules the application out."
          : "Preference or unconfirmed detail — not a blocker."}
      </p>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
  className = "text-ink",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-faint mt-[3px]">{icon}</span>
      <div className="min-w-0">
        <p className="text-faint text-[11px]">{label}</p>
        <p className={`truncate text-sm ${className}`}>{value}</p>
      </div>
    </div>
  );
}

export function JobDetail({
  job,
  today,
  onClose,
  onStatusChange,
  onPatch,
  onToggleDocument,
  onAnswer,
}: {
  job: TrackedJob;
  today: string;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onPatch: (patch: Partial<ApplicationState>) => void;
  onToggleDocument: (document: string) => void;
  onAnswer: (index: number, value: string) => void;
}) {
  const { state } = job;
  const blocked = isIneligible(job);
  const blocker = blockerReason(job);
  const deadline = describeDeadline(job.deadline, job.deadlineNote, today);

  // Escape closes; the page behind must not scroll while the modal is open.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${job.company} — ${job.title}`}
      onClick={onClose}
    >
      <div className="flex min-h-full justify-center p-0 sm:p-6">
        <div
          onClick={(event) => event.stopPropagation()}
          className="border-line bg-surface animate-rise h-fit w-full rounded-none border shadow-2xl shadow-black/50 sm:max-w-3xl sm:rounded-2xl"
        >
          {/* --- Header ------------------------------------------------- */}
          <div className="border-line bg-surface sticky top-0 z-10 rounded-t-2xl border-b px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={state.status} />
                  <PriorityBadge priority={job.priority} />
                  {state.waitingOn ? (
                    <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">
                      <TimerReset className="h-3 w-3" />
                      Waiting
                    </Badge>
                  ) : null}
                  {blocked ? (
                    <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-300">
                      <ShieldAlert className="h-3 w-3" />
                      Ineligible
                    </Badge>
                  ) : null}
                </div>
                <h2 className="text-ink mt-2.5 text-lg leading-snug font-semibold">
                  {job.title}
                </h2>
                <p className="text-muted mt-0.5 text-sm">
                  {job.company} · {job.location}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="hidden sm:block">
                  <FitScore score={job.fitScore} chance={job.chance} size="lg" />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong rounded-lg border p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="border-accent/30 bg-accent/10 text-ink hover:bg-accent/15 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors"
              >
                Open application
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="text-faint text-[11px]">
                Application state is saved locally and is never overwritten by a data
                refresh.
              </span>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            {blocked && blocker ? (
              <div className="flex gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/[0.07] p-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                <div>
                  <p className="text-sm font-medium text-rose-200">
                    Hard eligibility blocker
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-rose-200/80">
                    {blocker}
                  </p>
                </div>
              </div>
            ) : null}

            {/* --- Status management ------------------------------------ */}
            <section>
              <h3 className="text-ink mb-3 flex items-center gap-2 text-sm font-medium">
                <Target className="h-3.5 w-3.5" />
                Application status
              </h3>
              <StatusStepper status={state.status} onChange={onStatusChange} />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-faint mb-1.5 block text-[11px] font-medium tracking-wide uppercase">
                    Waiting on (blocker)
                  </span>
                  <input
                    type="text"
                    value={state.waitingOn ?? ""}
                    placeholder="e.g. English test result"
                    onChange={(event) =>
                      onPatch({ waitingOn: event.target.value || null })
                    }
                    className="border-line bg-canvas text-ink placeholder:text-faint focus:border-line-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-faint mb-1.5 block text-[11px] font-medium tracking-wide uppercase">
                    Date applied
                  </span>
                  <input
                    type="date"
                    value={state.appliedOn ?? ""}
                    onChange={(event) =>
                      onPatch({ appliedOn: event.target.value || null })
                    }
                    className="border-line bg-canvas text-ink focus:border-line-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </label>
              </div>
            </section>

            {/* --- Overview --------------------------------------------- */}
            <Section title="Job summary" icon={<FileText className="h-3.5 w-3.5" />}>
              <p className="text-muted text-sm leading-relaxed">{job.summary}</p>

              <div className="border-line bg-surface-2/40 mt-4 grid gap-4 rounded-lg border p-3.5 sm:grid-cols-3">
                <MetaRow
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  label="Location"
                  value={job.location}
                />
                <MetaRow
                  icon={<Briefcase className="h-3.5 w-3.5" />}
                  label="Employment type"
                  value={`${job.employmentType} · ${job.roleType}`}
                />
                <MetaRow
                  icon={<Banknote className="h-3.5 w-3.5" />}
                  label="Salary"
                  value={formatSalary(job.salary)}
                  className={job.salary ? "text-ink" : "text-faint italic"}
                />
                <MetaRow
                  icon={<CalendarClock className="h-3.5 w-3.5" />}
                  label="Deadline"
                  value={
                    job.deadline
                      ? `${formatDate(job.deadline)} · ${deadline.label}`
                      : deadline.label
                  }
                />
                <MetaRow
                  icon={<Sparkle className="h-3.5 w-3.5" />}
                  label="Discovered"
                  value={formatDate(job.dateDiscovered)}
                />
                <MetaRow
                  icon={<Target className="h-3.5 w-3.5" />}
                  label="Fit / chance"
                  value={`${job.fitScore}/10 · ${job.chance}`}
                />
              </div>
            </Section>

            {/* --- Eligibility ------------------------------------------ */}
            <Section
              title="Eligibility"
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              hint="Hard blockers vs preferences"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <EligibilityCard
                  title="Visa / work rights"
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                  eligibility={job.visaFit}
                />
                <EligibilityCard
                  title="Academic requirement"
                  icon={<GraduationCap className="h-3.5 w-3.5" />}
                  eligibility={job.gradeRequirement}
                />
              </div>
            </Section>

            {/* --- Fit and gaps ----------------------------------------- */}
            <Section title="Why it fits" icon={<Plus className="h-3.5 w-3.5" />}>
              <BulletList items={job.whyFit} marker="bg-emerald-400/70" />
            </Section>

            <Section title="Main gaps" icon={<Minus className="h-3.5 w-3.5" />}>
              <BulletList items={job.gaps} marker="bg-amber-400/60" />
            </Section>

            {/* --- Required documents ----------------------------------- */}
            <Section
              title="Required documents"
              icon={<ListChecks className="h-3.5 w-3.5" />}
              hint="Ticks are saved with your application state"
            >
              {job.submit.length ? (
                <ul className="space-y-1.5">
                  {job.submit.map((document) => {
                    const done = Boolean(state.documents[document]);
                    return (
                      <li key={document}>
                        <label className="hover:bg-surface-2/60 flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => onToggleDocument(document)}
                            className="accent-accent mt-[3px] h-3.5 w-3.5"
                          />
                          <span
                            className={`text-sm ${
                              done ? "text-faint line-through" : "text-muted"
                            }`}
                          >
                            {document}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-faint text-sm">Nothing listed on the posting.</p>
              )}
            </Section>

            {/* --- Assessment ------------------------------------------- */}
            <Section
              title="Assessment & interview steps"
              icon={<Mic className="h-3.5 w-3.5" />}
            >
              {job.assessment.length ? (
                <ol className="space-y-2">
                  {job.assessment.map((step, i) => (
                    <li key={i} className="text-muted flex gap-3 text-sm leading-relaxed">
                      <span className="border-line text-faint mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-faint text-sm">Process not published.</p>
              )}
            </Section>

            {/* --- CV --------------------------------------------------- */}
            <EditableSection
              title="CV tweaks"
              icon={<PenLine className="h-3.5 w-3.5" />}
              hint="Your edits — kept on refresh"
              suggestion={
                job.suggestedCvBullets.length
                  ? job.suggestedCvBullets.map((bullet) => `• ${bullet}`).join("\n")
                  : undefined
              }
              suggestionLabel="Suggested CV bullet edits"
              value={state.cvTweaks}
              onChange={(value) => onPatch({ cvTweaks: value })}
              placeholder="What you actually changed on the CV for this role…"
              rows={5}
            >
              <div className="border-line bg-surface-2/40 mb-3 rounded-lg border p-3">
                <p className="text-faint mb-1.5 text-[11px] font-medium tracking-wide uppercase">
                  CV strategy
                </p>
                <p className="text-muted text-sm leading-relaxed">{job.cvStrategy}</p>
              </div>
            </EditableSection>

            {/* --- Tailored summary ------------------------------------- */}
            <EditableSection
              title="Tailored summary / profile"
              icon={<UserRoundPen className="h-3.5 w-3.5" />}
              suggestion={job.suggestedTailoredSummary}
              value={state.tailoredSummary}
              onChange={(value) => onPatch({ tailoredSummary: value })}
              placeholder="The profile paragraph you will paste at the top of the CV…"
              rows={4}
            />

            {/* --- Cover letter ----------------------------------------- */}
            <EditableSection
              title="Cover letter"
              icon={<Mail className="h-3.5 w-3.5" />}
              hint={job.coverLetterNeeded ? "Required" : "Optional"}
              suggestion={job.suggestedCoverLetterAngle}
              suggestionLabel="Suggested angle"
              value={state.coverLetter}
              onChange={(value) => onPatch({ coverLetter: value })}
              placeholder="Draft or paste the cover letter here…"
              rows={7}
            />

            {/* --- Application questions -------------------------------- */}
            <Section
              title="Application questions"
              icon={<MessageSquareQuote className="h-3.5 w-3.5" />}
              hint="Your answers are saved"
            >
              {job.applicationQuestions.length ? (
                <div className="space-y-4">
                  {job.applicationQuestions.map((item, index) => (
                    <div key={index} className="border-line rounded-lg border p-3">
                      <p className="text-ink text-sm font-medium">{item.question}</p>
                      <p className="text-faint mt-2 border-l border-white/10 pl-3 text-sm leading-relaxed italic">
                        {item.suggestedDraft}
                      </p>
                      <textarea
                        value={state.answers[index] ?? ""}
                        rows={4}
                        placeholder="Your answer…"
                        onChange={(event) => onAnswer(index, event.target.value)}
                        className="border-line bg-canvas text-ink placeholder:text-faint focus:border-line-strong mt-3 w-full resize-y rounded-lg border p-3 text-sm leading-relaxed transition-colors outline-none"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-faint text-sm">
                  No written questions on this application.
                </p>
              )}
            </Section>

            {/* --- Interview prep --------------------------------------- */}
            <EditableSection
              title="Interview preparation"
              icon={<Mic className="h-3.5 w-3.5" />}
              value={state.interviewPrep}
              onChange={(value) => onPatch({ interviewPrep: value })}
              placeholder="Stories to prepare, questions to ask, things to revise…"
              rows={5}
            >
              <div className="mb-3">
                <p className="text-faint mb-2 text-[11px] font-medium tracking-wide uppercase">
                  Themes to expect
                </p>
                <BulletList
                  items={job.interviewThemes}
                  marker="bg-teal-400/60"
                  empty="No themes recorded for this role yet."
                />
              </div>
            </EditableSection>

            {/* --- Notes ------------------------------------------------ */}
            <EditableSection
              title="Notes"
              icon={<StickyNote className="h-3.5 w-3.5" />}
              value={state.notes}
              onChange={(value) => onPatch({ notes: value })}
              placeholder="Follow-ups, recruiter names, anything worth remembering…"
              rows={3}
            />

            {/* --- History ---------------------------------------------- */}
            {state.history.length ? (
              <Section title="Status history" icon={<History className="h-3.5 w-3.5" />}>
                <ol className="space-y-2.5">
                  {[...state.history].reverse().map((event, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${
                          STATUS_META[event.status].dot
                        }`}
                      />
                      <div>
                        <p className="text-muted text-sm">
                          {STATUS_META[event.status].label}
                          <span className="text-faint"> · {formatDate(event.date)}</span>
                        </p>
                        {event.note ? (
                          <p className="text-faint mt-0.5 text-xs">{event.note}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
