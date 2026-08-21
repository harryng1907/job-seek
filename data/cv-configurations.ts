import { resumeLibrary } from "@/data/resumes";
import { createConfiguration, findBase } from "@/lib/resume";
import type { CvConfiguration, CvConfigurationMap } from "@/types/resume";

/**
 * Seed CV versions.
 *
 * Like the application-state seed, these only fill in versions the user has
 * never seen — localStorage wins from the first edit onwards. Timestamps are
 * fixed strings rather than `Date.now()` so the server and client renders match.
 */
function seed(
  id: string,
  name: string,
  baseId: string,
  jobId: string | null,
  overrides: Partial<CvConfiguration> = {},
): CvConfiguration {
  const base = findBase(resumeLibrary, baseId) ?? resumeLibrary.bases[0];
  return {
    ...createConfiguration(resumeLibrary, base, { id, name, jobId }),
    createdAt: "2026-08-14T09:00:00+10:00",
    updatedAt: "2026-08-19T20:00:00+10:00",
    savedAt: "2026-08-19T20:00:00+10:00",
    ...overrides,
  };
}

const masterData = seed("cfg-master-data", "Master — Data CV", "data", null, {
  createdAt: "2026-08-01T09:00:00+10:00",
  updatedAt: "2026-08-01T09:00:00+10:00",
  savedAt: "2026-08-01T09:00:00+10:00",
  notes:
    "The graduate CV with the family defaults switched on. Duplicate this rather than editing it when tailoring for a role.",
});

const masterRetail = seed("cfg-master-retail", "Master — Retail CV", "retail", null, {
  createdAt: "2026-08-01T09:05:00+10:00",
  updatedAt: "2026-08-01T09:05:00+10:00",
  savedAt: "2026-08-01T09:05:00+10:00",
  notes:
    "The part-time CV: Arc roles lead as experience, projects off, working rights and availability on.",
});

/** Consulting / infrastructure angle: the AI-assisted project is left out. */
const ghdBase = createConfiguration(
  resumeLibrary,
  findBase(resumeLibrary, "data") ?? resumeLibrary.bases[0],
  { id: "cfg-ghd", name: "", jobId: null },
);

const ghd = seed(
  "cfg-ghd",
  "GHD — Asset Management / Data Science",
  "data",
  "ghd-graduate-program-2026",
  {
    summary:
      "Final-year UNSW Data Science student with hands-on experience in predictive modelling, Python automation and analytics for real operational problems. Comfortable moving between modelling and plain-English recommendations for non-technical stakeholders.",
    sections: {
      ...ghdBase.sections,
      projects: {
        order: [
          "proj-analytics-case-comp",
          "proj-f1-capstone",
          "proj-ai-assisted-delivery",
        ],
        // Consulting audience — the case competition and capstone carry more weight.
        excluded: ["proj-ai-assisted-delivery"],
      },
    },
    bulletChoice: {
      ...ghdBase.bulletChoice,
      "proj-analytics-case-comp": "consulting",
    },
    notes:
      "Assessment centre scores communication explicitly. Keep the case-competition pitch bullet — it is the closest thing to consulting delivery on the CV.",
  },
);

/** Part-time version, drawn from the same library with retail emphasis. */
const arcRetail = seed(
  "cfg-arc-retail",
  "Arc @UNSW — Retail Assistant",
  "retail",
  "arc-unsw-retail-assistant",
  {
    createdAt: "2026-08-19T18:00:00+10:00",
    updatedAt: "2026-08-19T18:00:00+10:00",
    savedAt: null,
    notes:
      "Same employer as the existing volunteering — lead with Food Hub and Checkpoint, keep it to one page.",
  },
);

export const seedCvConfigurations: CvConfigurationMap = {
  [masterData.id]: masterData,
  [masterRetail.id]: masterRetail,
  [ghd.id]: ghd,
  [arcRetail.id]: arcRetail,
};
