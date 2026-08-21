import { createApplicationState } from "@/lib/application-state";
import type { ApplicationStateMap } from "@/types/application";

/**
 * Seed application state — the user's starting pipeline.
 *
 * This is only a *seed*. Once the dashboard has run in the browser, the real
 * source of truth is localStorage (later: the user's row in Supabase), and the
 * seed is used solely to fill in jobs that have never been seen before.
 *
 * Nothing here comes from the job-search pipeline; it is all manual state.
 */
export const seedApplicationState: ApplicationStateMap = {
  "macquarie-data-quality-analyst": createApplicationState(
    "macquarie-data-quality-analyst",
    {
      status: "new",
      notes:
        "Found by today's run. Rolling close, so triage and apply within 48 hours.",
      history: [{ status: "new", date: "2026-08-21", note: "Added by daily run." }],
      updatedAt: "2026-08-21T08:15:00+10:00",
    },
  ),

  "hdi-graduate-data-analyst": createApplicationState("hdi-graduate-data-analyst", {
    status: "to-apply",
    notes:
      "Closes 29 Aug. Best fit on the board — this is the priority application this week.",
    documents: { "CV (2 pages, analytics-first)": true },
    history: [
      { status: "new", date: "2026-08-21", note: "Added by daily run." },
      { status: "to-apply", date: "2026-08-21", note: "Triaged as priority." },
    ],
    updatedAt: "2026-08-21T09:02:00+10:00",
  }),

  "ghd-graduate-program-2026": createApplicationState("ghd-graduate-program-2026", {
    status: "to-apply",
    notes:
      "Email graduate recruitment about 485 eligibility BEFORE writing the cover letter — the whole application is wasted if the answer is PR-only.",
    history: [
      { status: "new", date: "2026-08-19" },
      { status: "to-apply", date: "2026-08-19" },
    ],
    updatedAt: "2026-08-19T19:40:00+10:00",
  }),

  "earth-ai-graduate-ai-engineer": createApplicationState(
    "earth-ai-graduate-ai-engineer",
    {
      status: "tailoring",
      cvTweaks:
        "Technical CV version in progress. Still to do: add repo links per project, cut the two business-framing bullets, tidy the GitHub README before sending.",
      notes:
        "Reach on domain, best technical fit on the board. GitHub cleanup is the blocker, not the CV itself.",
      documents: { "CV (2 pages, technical)": true },
      history: [
        { status: "new", date: "2026-08-20" },
        { status: "to-apply", date: "2026-08-20" },
        { status: "tailoring", date: "2026-08-21", note: "Started the technical CV rewrite." },
      ],
      updatedAt: "2026-08-21T07:55:00+10:00",
    },
  ),

  "pharmacare-business-analyst-graduate": createApplicationState(
    "pharmacare-business-analyst-graduate",
    {
      status: "to-apply",
      notes:
        "Solid fallback. Worth applying, but not ahead of HDI or Macquarie this week. Check the commute before interview stage.",
      history: [
        { status: "new", date: "2026-08-18" },
        { status: "to-apply", date: "2026-08-18" },
      ],
      updatedAt: "2026-08-18T20:10:00+10:00",
    },
  ),

  "woolloo-graduate-ai-data-product": createApplicationState(
    "woolloo-graduate-ai-data-product",
    {
      status: "to-apply",
      notes:
        "Two written responses are the differentiator. Block out two hours rather than filling them in the night before the 12 Sep close.",
      history: [
        { status: "new", date: "2026-08-17" },
        { status: "to-apply", date: "2026-08-17" },
      ],
      updatedAt: "2026-08-17T18:25:00+10:00",
    },
  ),

  "whitehaven-graduate-data-engineer": createApplicationState(
    "whitehaven-graduate-data-engineer",
    {
      status: "to-apply",
      notes:
        "Blocked: citizens/PR only. Kept on the board as a reference for the data engineering stack to build toward. Archive it unless the 2028 intake relaxes the requirement.",
      history: [{ status: "new", date: "2026-08-16" }],
      updatedAt: "2026-08-16T12:00:00+10:00",
    },
  ),

  "ey-graduate-international-eoi": createApplicationState(
    "ey-graduate-international-eoi",
    {
      status: "tailoring",
      waitingOn: "English test evidence — PTE/IELTS result not yet available",
      notes:
        "WAITING on the English test. Book PTE now: results land in ~2 business days and the EOI closes 30 Sep. Nothing else about this application can proceed until that upload exists.",
      documents: { "EOI form": false, CV: true, "Academic transcript": true },
      history: [
        { status: "new", date: "2026-08-12" },
        {
          status: "tailoring",
          date: "2026-08-12",
          note: "EOI drafted; blocked on English test evidence.",
        },
      ],
      updatedAt: "2026-08-14T09:30:00+10:00",
    },
  ),

  "usyd-ai-graduate": createApplicationState("usyd-ai-graduate", {
    status: "applied",
    appliedOn: "2026-08-10",
    coverLetter:
      "Submitted. Structured as one paragraph per selection criterion, each opening with the criterion in bold and closing with a named example.",
    documents: { CV: true, "Cover letter addressing the selection criteria": true, "Two referees": true },
    notes:
      "Applied 10 Aug. Panel processes take 3–4 weeks to shortlist — follow up with the talent contact if nothing by 4 Sep.",
    history: [
      { status: "new", date: "2026-08-04", note: "Role found." },
      { status: "to-apply", date: "2026-08-05" },
      { status: "tailoring", date: "2026-08-07", note: "Criteria-addressed cover letter drafted." },
      { status: "applied", date: "2026-08-10", note: "Submitted with two referees." },
    ],
    updatedAt: "2026-08-10T16:45:00+10:00",
  }),

  "suncorp-technology-data-science-graduate": createApplicationState(
    "suncorp-technology-data-science-graduate",
    {
      status: "assessment",
      appliedOn: "2026-08-06",
      interviewPrep:
        "Criteria assessment is timed — practise numerical and situational judgement sets first. Then refresh insurance vocabulary: premium, claims frequency, severity, loss ratio, reserving.",
      documents: { "Online application": true, "Academic transcript": true, "Online criteria assessment": false },
      notes:
        "Criteria assessment PENDING — due 25 Aug. Applied 6 Aug, invited to assessment 18 Aug. Raise the 485 end-date question with the recruiter before the assessment centre.",
      history: [
        { status: "new", date: "2026-07-30", note: "Program found, Data Science stream selected." },
        { status: "to-apply", date: "2026-07-31" },
        { status: "applied", date: "2026-08-06", note: "Application submitted." },
        { status: "assessment", date: "2026-08-18", note: "Invited to the online criteria assessment." },
      ],
      updatedAt: "2026-08-18T11:20:00+10:00",
    },
  ),

  // --- Part-time / income track -------------------------------------------

  "arc-unsw-retail-assistant": createApplicationState("arc-unsw-retail-assistant", {
    status: "new",
    notes:
      "Best part-time option: on campus, already an Arc volunteer, quick application. Closes 28 Aug.",
    history: [{ status: "new", date: "2026-08-21", note: "Added by daily run." }],
    updatedAt: "2026-08-21T08:15:00+10:00",
  }),

  "woolworths-campsie-customer-service": createApplicationState(
    "woolworths-campsie-customer-service",
    {
      status: "to-apply",
      notes:
        "Ten minutes from home and guaranteed hours. Check the roster against class times before accepting — 20 hrs/week is close to the 48-hour fortnight visa cap.",
      history: [
        { status: "new", date: "2026-08-19" },
        { status: "to-apply", date: "2026-08-19" },
      ],
      updatedAt: "2026-08-19T21:05:00+10:00",
    },
  ),

  "uniqlo-sales-assistant-cbd": createApplicationState("uniqlo-sales-assistant-cbd", {
    status: "to-apply",
    notes:
      "Good rate, but 35 minutes each way. Only worth it for longer weekend shifts, not a 4-hour weekday.",
    history: [
      { status: "new", date: "2026-08-20" },
      { status: "to-apply", date: "2026-08-20" },
    ],
    updatedAt: "2026-08-20T19:30:00+10:00",
  }),

  "unsw-student-ambassador": createApplicationState("unsw-student-ambassador", {
    status: "tailoring",
    notes:
      "Two written responses still to draft — the longest part-time application on the board, but the best hourly rate. Due 4 Sep.",
    documents: { "Enrolment confirmation": true },
    history: [
      { status: "new", date: "2026-08-15" },
      { status: "to-apply", date: "2026-08-15" },
      {
        status: "tailoring",
        date: "2026-08-20",
        note: "Started the written responses.",
      },
    ],
    updatedAt: "2026-08-20T22:10:00+10:00",
  }),
};
