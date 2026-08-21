import type { JobBoard } from "@/types/job";

/**
 * Mock job data — stands in for the daily job-search pipeline.
 *
 * This file contains *only* pipeline-owned data. It can be regenerated or
 * replaced wholesale (by a JSON drop, an API response or a Supabase query)
 * without touching the user's application state, which lives in
 * `data/application-state.ts` and localStorage.
 *
 * Eligibility notes are working assumptions to verify against each posting,
 * not confirmed employer policy.
 */
export const jobBoard: JobBoard = {
  lastUpdated: "2026-08-21T08:15:00+10:00",
  jobs: [
    {
      id: "hdi-graduate-data-analyst",
      track: "graduate",
      company: "HDI Global",
      title: "Graduate Data Analyst",
      location: "Sydney CBD, NSW",
      employmentType: "Graduate Program",
      roleType: "Analytics",
      salary: "$75,000 – $80,000 + super",
      priority: "apply-asap",
      fitScore: 9,
      chance: "strong",
      visaFit: {
        level: "likely",
        hardRequirement: false,
        note: "Asks for ongoing work rights in Australia. Currently on a Student Visa (subclass 500) with a 48-hour fortnight cap; a graduate role starting after the December 2026 completion would run on a 485. Confirm the employer accepts a 485 rather than PR.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "Credit average preferred, no published WAM cut-off. Preference only, not a blocker.",
      },
      deadline: "2026-08-29",
      dateDiscovered: "2026-08-21",
      summary:
        "Entry-level analyst inside the local data & analytics team of a global industrial insurer. Focus is underwriting and claims reporting: cleaning broker-supplied data, maintaining Power BI dashboards for portfolio performance, and supporting pricing analysts with SQL extracts. Small team, generalist scope, strong graduate mentoring reputation.",
      whyFit: [
        "SQL + Power BI is the core of the role and the strongest part of the CV.",
        "Insurance analytics extends the risk and statistics coursework directly.",
        "Small team means broad exposure rather than a narrow reporting seat.",
      ],
      gaps: [
        "No insurance or reinsurance domain experience.",
        "Power BI experience is from projects, not a production reporting environment.",
      ],
      submit: [
        "CV (2 pages, analytics-first)",
        "Cover letter — required",
        "Academic transcript (unofficial accepted)",
      ],
      assessment: [
        "Recruiter phone screen (~20 min)",
        "SQL + Excel case exercise, take-home",
        "Panel interview with hiring manager and a senior analyst",
      ],
      applicationUrl: "https://www.seek.com.au/",
      cvStrategy:
        "Lead with the analytics stack (SQL, Power BI, Python) in the top third. Reframe university projects as reporting deliverables with stakeholders and turnaround times rather than as models. Move deep ML work into a single 'Technical projects' line so the CV reads analyst, not researcher.",
      suggestedTailoredSummary:
        "Data analytics graduate with hands-on SQL, Power BI and Python experience, delivering reporting and data-quality work on messy, multi-source datasets. Comfortable translating stakeholder questions into repeatable dashboards, and looking to apply that in a commercial insurance portfolio.",
      suggestedCvBullets: [
        "Built and maintained a Power BI dashboard over 40k+ records, cutting a manual weekly reporting task from ~3 hours to under 10 minutes.",
        "Wrote SQL to join and reconcile five source tables, resolving a ~2% duplicate-key rate before analysis.",
        "Presented findings to a non-technical audience as a one-page summary and recommendation.",
      ],
      coverLetterNeeded: true,
      suggestedCoverLetterAngle:
        "Three short paragraphs: why insurance analytics specifically (risk modelling coursework), one concrete example of cleaning and reporting on messy data end to end, and why a small team beats a large rotational program for learning speed.",
      applicationQuestions: [
        {
          question: "Why are you interested in the insurance industry?",
          suggestedDraft:
            "Insurance is one of the few industries where the product itself is a statistical model, so analytical work sits next to the commercial decision rather than downstream of it. My risk and probability coursework plus a portfolio-loss project made that link concrete, and HDI's industrial specialty lines mean the data is genuinely varied rather than mass-market.",
        },
        {
          question: "Describe a time you worked with imperfect data.",
          suggestedDraft:
            "In my final-year project the supplied dataset had ~2% duplicate keys and inconsistent date formats across two source systems. I profiled the columns first, documented every rule I applied, rebuilt the join on a composite key, and reported the residual uncertainty alongside the results rather than hiding it.",
        },
      ],
      interviewThemes: [
        "SQL live exercise: joins, window functions, deduplication",
        "Explaining a technical result to an underwriter",
        "Data quality: how to detect it and how to communicate it",
        "Why insurance, why HDI, why a small team",
      ],
      sourceNotes: "Highest scored role currently on the board.",
    },
    {
      id: "macquarie-data-quality-analyst",
      track: "graduate",
      company: "Macquarie Group",
      title: "Data Analyst — Data Quality & Remediation",
      location: "Sydney, NSW (hybrid)",
      employmentType: "Full-time",
      roleType: "Analytics",
      salary: null,
      priority: "apply-asap",
      fitScore: 8,
      chance: "reasonable",
      visaFit: {
        level: "likely",
        hardRequirement: false,
        note: "Requires valid work rights for the full term. Not a citizens-only role, but banking background checks are thorough — have the visa grant notice and ID ready.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "No published grade cut-off — an experienced-hire style posting judged on skills rather than WAM.",
      },
      deadline: null,
      deadlineNote: "Rolling — closes once filled",
      dateDiscovered: "2026-08-21",
      summary:
        "Analyst role inside the data governance function, working on remediation of data-quality issues across risk and finance datasets. Day to day is profiling datasets against defined quality rules, tracing breaks back to source systems, and working with data owners to close them. Heavy SQL, some Python, exposure to lineage tooling.",
      whyFit: [
        "Data-quality profiling and reconciliation is exactly what the capstone project involved, at smaller scale.",
        "Not badged as a graduate program, so a strong skills match can outweigh limited experience.",
        "Macquarie brand value carries into every subsequent application.",
      ],
      gaps: [
        "No financial services experience and no exposure to regulatory reporting (BCBS 239, APRA standards).",
        "No hands-on time with enterprise governance tooling such as Collibra or Informatica.",
        "Competing against candidates with 1–2 years of commercial experience.",
      ],
      submit: [
        "CV (2 pages)",
        "Cover letter — optional",
        "Online form with work-rights declaration",
      ],
      assessment: [
        "Recruiter screen",
        "Hiring manager interview — SQL and data-quality scenarios",
        "Final interview with the governance lead",
      ],
      applicationUrl: "https://www.macquarie.com/au/en/careers.html",
      cvStrategy:
        "Rewrite the top of the CV around data quality, reconciliation and lineage vocabulary. Quantify record volumes and error rates everywhere. Drop anything that reads as pure academia — a governance team wants evidence of disciplined, documented process.",
      suggestedTailoredSummary:
        "Analyst with strong SQL and Python skills and a track record of profiling, reconciling and documenting messy multi-source data. Interested in governance and remediation work where the deliverable is trustworthy data rather than a one-off model.",
      suggestedCvBullets: [
        "Profiled a 250k-row multi-source dataset against defined completeness and validity rules, documenting every exception and its root cause.",
        "Automated a reconciliation check in Python that flagged mismatches between two source extracts before downstream reporting.",
        "Maintained a written data dictionary so a second analyst could reproduce the pipeline without a handover call.",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "Optional, but a short letter helps here: name the gap (no banking experience) up front and answer it with concrete data-quality process evidence and obvious appetite for governance work.",
      applicationQuestions: [
        {
          question: "What does good data quality mean to you?",
          suggestedDraft:
            "Data is good enough when the people deciding on it know its limits. Practically that means measurable rules — completeness, validity, uniqueness, timeliness — applied at the source rather than patched downstream, with exceptions documented rather than quietly dropped.",
        },
      ],
      interviewThemes: [
        "SQL: window functions, deduplication, reconciliation queries",
        "Root-cause tracing of a data break back through source systems",
        "Working with data owners who do not want more work",
        "Why financial services, and why governance over modelling",
      ],
      sourceNotes: "Rolling close — these listings are pulled quickly once shortlisted.",
    },
    {
      id: "ghd-graduate-program-2026",
      track: "graduate",
      company: "GHD",
      title: "Graduate Program 2026/27 — Asset Management / Data Science",
      location: "Sydney, NSW",
      employmentType: "Graduate Program",
      roleType: "Data Science",
      salary: null,
      priority: "apply-asap",
      fitScore: 8,
      chance: "reasonable",
      visaFit: {
        level: "unclear",
        hardRequirement: false,
        note: "Posting asks for unrestricted working rights. Currently Student Visa (subclass 500), moving to a 485 after December 2026 — whether that counts as 'unrestricted' is not stated. Email graduate recruitment before spending a day on the application.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "Credit average stated as a guide, not a cut-off. Not a hard blocker.",
      },
      deadline: "2026-09-05",
      dateDiscovered: "2026-08-19",
      summary:
        "Structured graduate program in the asset management and digital advisory practice. Graduates work on infrastructure asset data — condition scoring, failure prediction, lifecycle cost modelling — for water, transport and energy clients. Mix of consulting delivery and internal tool building, with a formal cohort and rotation options.",
      whyFit: [
        "Asset failure prediction applies the survival-analysis and classification work directly.",
        "Consulting exposure builds the client-facing skills that are thin on the CV.",
        "Structured program with a cohort — good for a first role in the Australian market.",
      ],
      gaps: [
        "No engineering or infrastructure domain background.",
        "Graduate programs at this brand are heavily oversubscribed.",
        "Working-rights requirement is not yet confirmed.",
      ],
      submit: [
        "Online application form",
        "CV (2 pages)",
        "Cover letter — required, names the preferred stream",
        "Academic transcript",
      ],
      assessment: [
        "Online application with stream preference",
        "Psychometric and situational-judgement testing",
        "Recorded video interview",
        "Virtual assessment centre — group case plus individual interview",
      ],
      applicationUrl: "https://www.ghd.com/en/careers/graduates",
      cvStrategy:
        "Aim the CV at applied problem solving for physical assets, not at model accuracy. Lead each project bullet with the decision it supported. Add a line on stakeholder communication — assessment centres score that explicitly.",
      suggestedTailoredSummary:
        "Data science graduate interested in applying predictive analytics to physical infrastructure — condition, failure risk and lifecycle cost. Comfortable moving between Python modelling and plain-English recommendations for non-technical stakeholders.",
      suggestedCvBullets: [
        "Built a classification model predicting equipment failure from sensor and maintenance history, framed around the maintenance decision rather than the metric.",
        "Translated model output into a prioritised action list for a non-technical audience, with an explicit statement of what the model could not see.",
        "Worked in a four-person team to a fixed deadline, owning the data pipeline and the final presentation.",
      ],
      coverLetterNeeded: true,
      suggestedCoverLetterAngle:
        "Name the asset management / data science stream in the first line. Connect infrastructure resilience to the specific modelling work already done, and close on why consulting rather than in-house.",
      applicationQuestions: [
        {
          question: "Why GHD and why this stream?",
          suggestedDraft:
            "Asset management is where data science has an unusually direct payoff: a better failure model changes a maintenance schedule and a capital plan, not just a dashboard. GHD's water and transport client base means that work happens at real scale, and this stream is the only graduate role I have seen that pairs modelling with lifecycle decision-making.",
        },
        {
          question: "Tell us about a time you solved a problem in a team.",
          suggestedDraft:
            "In a four-person capstone the data arrived two weeks late and the original scope was no longer achievable. I proposed cutting to one asset class so we could still deliver end to end, split the remaining work by strength rather than interest, and we submitted complete rather than half-finished.",
        },
      ],
      interviewThemes: [
        "Group case exercise — contribute without dominating",
        "Explaining a model to a client with no statistics background",
        "Motivation for consulting over an in-house role",
        "Understanding of asset lifecycle and condition data",
      ],
      sourceNotes: "Large intake, multiple streams — stream choice is asked for at application.",
    },
    {
      id: "earth-ai-graduate-ai-engineer",
      track: "graduate",
      company: "Earth AI",
      title: "Graduate AI Engineer",
      location: "Alexandria, NSW (on-site)",
      employmentType: "Full-time",
      roleType: "AI / ML",
      salary: "$85,000 – $100,000 + equity",
      priority: "apply-asap",
      fitScore: 8,
      chance: "reach",
      visaFit: {
        level: "likely",
        hardRequirement: false,
        note: "Startup, no citizenship requirement stated. Smaller companies are sometimes cautious about visa end dates — be direct about the remaining term.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "No grade requirement published. Hiring is portfolio-driven — code and projects matter more than the transcript.",
      },
      deadline: null,
      deadlineNote: "Rolling — small team, hires opportunistically",
      dateDiscovered: "2026-08-20",
      summary:
        "Mineral-exploration technology company using ML over geophysical, geochemical and remote-sensing data to predict drill targets. The graduate engineer role sits between research and production: training models on sparse, spatially correlated data and shipping them into the internal targeting platform. Small team, on-site, high ownership.",
      whyFit: [
        "Genuinely technical ML role rather than a reporting job badged as AI.",
        "Spatial and sparse-label problems overlap with the geospatial coursework.",
        "Small team means end-to-end ownership from data to deployed model.",
      ],
      gaps: [
        "No geoscience background — most of the team has one.",
        "Production ML experience is limited; projects have not been deployed and monitored.",
        "On-site expectation, so the commute matters.",
      ],
      submit: [
        "CV (2 pages, technical)",
        "GitHub or portfolio link — effectively mandatory",
        "Short note on why this problem, in place of a formal cover letter",
      ],
      assessment: [
        "Technical screen with an engineer",
        "Take-home ML task on a small, messy dataset",
        "On-site final — walk through the take-home plus team fit",
      ],
      applicationUrl: "https://www.earth-ai.com/careers",
      cvStrategy:
        "Make this the most technical version of the CV: architectures, libraries, evaluation approach and repository links per project. Cut the business framing. Tidy the GitHub first — it will be opened before the CV is finished.",
      suggestedTailoredSummary:
        "ML-focused graduate who enjoys small-data, high-uncertainty problems: spatial features, weak labels and models that have to be defended rather than just scored. Looking for a small team where the model reaches production rather than stopping at a notebook.",
      suggestedCvBullets: [
        "Trained and evaluated gradient-boosted and neural models on a sparse-label dataset, reporting calibrated probabilities rather than accuracy alone.",
        "Engineered spatial features (distance, density, neighbourhood aggregates) that lifted recall on the minority class.",
        "Packaged a model behind a small FastAPI service with tests, so results were reproducible outside the notebook.",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "No formal letter — send five sentences instead: the specific technical thing about drill-target prediction that is interesting (few positives, spatial autocorrelation, expensive labels), plus a link to the closest project.",
      applicationQuestions: [
        {
          question: "What interests you about applying ML to mineral exploration?",
          suggestedDraft:
            "The label economics are unusual: every positive costs a drill hole, so the model has to be honest about uncertainty rather than confident. That makes calibration, spatial cross-validation and leakage control the actual job — the part of ML I find most interesting and the part most business datasets never force you to get right.",
        },
      ],
      interviewThemes: [
        "Spatial cross-validation and leakage",
        "Class imbalance and calibration with few positives",
        "Take-home walkthrough — defend every choice",
        "Comfort with ambiguity and on-site startup pace",
      ],
      sourceNotes: "Portfolio-led process; GitHub quality is weighted heavily.",
    },
    {
      id: "pharmacare-business-analyst-graduate",
      track: "graduate",
      company: "PharmaCare",
      title: "Business Analyst (Graduate)",
      location: "Warriewood, NSW",
      employmentType: "Full-time",
      roleType: "Business Analysis",
      salary: "$70,000 – $78,000 + super",
      priority: "worth-applying",
      fitScore: 7,
      chance: "strong",
      visaFit: {
        level: "likely",
        hardRequirement: false,
        note: "Standard work-rights declaration, no citizenship requirement stated.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "No grade requirement listed.",
      },
      deadline: null,
      deadlineNote: "Rolling — closes when filled",
      dateDiscovered: "2026-08-18",
      summary:
        "Commercial analyst role in a consumer health and vitamins business. Work centres on sales and category reporting for major grocery and pharmacy retailers: scan data, promotional performance, forecast inputs and monthly packs for the sales team. Heavy Excel, a growing Power BI footprint, close contact with commercial stakeholders.",
      whyFit: [
        "Straightforward analytics stack with an unusually low barrier for a graduate.",
        "High chance of an offer — worth having a realistic live option in the pipeline.",
        "Commercial stakeholder exposure is a genuine gap-filler.",
      ],
      gaps: [
        "Excel-heavy and light on technical depth; limited Python or ML use.",
        "Warriewood commute is long from the city without a car.",
        "Career ceiling here is commercial rather than data science.",
      ],
      submit: ["CV (2 pages)", "Short cover letter", "Right-to-work declaration"],
      assessment: [
        "Phone screen with the talent team",
        "Excel exercise on scan/sales data",
        "Interview with the commercial manager",
      ],
      applicationUrl: "https://www.seek.com.au/",
      cvStrategy:
        "Down-weight the ML material and lead with Excel, reporting cadence and commercial analysis. This team wants someone who will reliably produce a monthly pack, not someone hunting for a modelling problem.",
      suggestedTailoredSummary:
        "Analytics graduate with strong Excel and SQL skills and experience turning transactional data into clear commercial reporting. Interested in category and sales analysis where the output drives a buying or promotional decision.",
      suggestedCvBullets: [
        "Built a reusable Excel model over transactional sales data, including variance-to-forecast and promotional uplift views.",
        "Produced a recurring one-page summary for non-technical stakeholders, standardising definitions so numbers matched across reports.",
        "Used SQL to pull and aggregate raw transaction data ahead of analysis, removing a manual export step.",
      ],
      coverLetterNeeded: true,
      suggestedCoverLetterAngle:
        "Short and practical. Emphasise reliability and reporting cadence, familiarity with retail scan data concepts, and genuine interest in consumer health as a category. Address the commute proactively.",
      applicationQuestions: [
        {
          question: "How do you handle competing reporting deadlines?",
          suggestedDraft:
            "I work backwards from the fixed dates — month-end and promotional reviews do not move — and automate whatever recurs so the repeat work shrinks each cycle. When something genuinely cannot fit, I flag it early with an option rather than quietly delivering late.",
        },
      ],
      interviewThemes: [
        "Excel exercise: pivots, lookups, variance analysis",
        "Explaining a sales trend and recommending an action",
        "Handling a stakeholder who disagrees with the numbers",
        "Commute and on-site expectations",
      ],
      sourceNotes: "Consistently high graduate conversion rate at this employer.",
    },
    {
      id: "woolloo-graduate-ai-data-product",
      track: "graduate",
      company: "Woolloo",
      title: "Graduate — AI / Data / Product",
      location: "Barangaroo, NSW",
      employmentType: "Graduate Program",
      roleType: "Product",
      salary: null,
      priority: "worth-applying",
      fitScore: 7,
      chance: "reasonable",
      visaFit: {
        level: "unclear",
        hardRequirement: false,
        note: "Working rights not specified in the posting. Ask at screen stage rather than assuming either way.",
      },
      gradeRequirement: {
        level: "likely",
        hardRequirement: false,
        note: "Distinction average listed as preferred, not required — a preference, not a blocker.",
      },
      deadline: "2026-09-12",
      dateDiscovered: "2026-08-17",
      summary:
        "Rotational graduate track spanning AI engineering, data and product. Graduates rotate across squads building customer-facing features, with a stated aim of producing hybrid technical/product people rather than specialists. The posting emphasises communication, curiosity and shipping.",
      whyFit: [
        "Rotations give product exposure, the hardest experience to get straight out of university.",
        "The AI/data component keeps technical skills live rather than parking them.",
        "Barangaroo location and a modern stack.",
      ],
      gaps: [
        "Product experience is essentially zero — no user research or roadmap exposure.",
        "Rotational structure means less depth in any one area.",
        "Assessment likely weights communication over technical ability.",
      ],
      submit: [
        "Online form",
        "CV (2 pages)",
        "Two short written responses (300 words each)",
        "Transcript",
      ],
      assessment: [
        "Written application responses",
        "Online cognitive assessment",
        "Video interview",
        "Assessment centre — product case exercise",
      ],
      applicationUrl: "https://www.woolloo.com.au/careers",
      cvStrategy:
        "Balance the CV rather than making it technical: keep the modelling work but add the decision and the user for every project. Include tutoring, teaching or presenting experience — it reads directly onto the product competencies.",
      suggestedTailoredSummary:
        "Graduate with a technical data background and a strong interest in the product side of AI — how a model becomes something a customer actually uses. Comfortable both building and explaining, and looking for a rotational role to develop breadth early.",
      suggestedCvBullets: [
        "Scoped a data project by starting from the user's decision, then chose the simplest model that supported it.",
        "Ran a short user-feedback loop on a prototype dashboard and cut two features nobody used.",
        "Presented technical work to mixed technical and non-technical audiences on a recurring basis.",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "No letter, but the two written responses carry the same weight — draft them properly and cut every generic sentence. Specific examples beat enthusiasm here.",
      applicationQuestions: [
        {
          question: "Describe a product you admire and one thing you would change.",
          suggestedDraft:
            "Pick something used daily, name the specific job it does well, then propose one narrow, testable change with the metric that would prove it worked. Avoid redesigning the whole product — restraint scores better than ambition here.",
        },
        {
          question: "Tell us about a time you changed your mind based on evidence.",
          suggestedDraft:
            "In a project I assumed a complex model was needed; a baseline came within two points of it at a fraction of the cost, so I shipped the baseline and documented the trade-off. The lesson was that the interesting solution and the correct one are frequently not the same.",
        },
      ],
      interviewThemes: [
        "Product case: scope, users, success metric",
        "Prioritisation under constraints",
        "Explaining an AI concept simply",
        "Motivation for a rotational program",
      ],
      sourceNotes: "Written responses are the main differentiator at first pass.",
    },
    {
      id: "whitehaven-graduate-data-engineer",
      track: "graduate",
      company: "Whitehaven Coal",
      title: "Graduate Data Engineer",
      location: "Newcastle, NSW (hybrid)",
      employmentType: "Graduate Program",
      roleType: "Data Engineering",
      salary: "$80,000 – $88,000 + super",
      priority: "skip",
      fitScore: 7,
      chance: "reach",
      visaFit: {
        level: "blocked",
        hardRequirement: true,
        note: "Program is open to Australian or New Zealand citizens and permanent residents only. Hard requirement — not something a strong application can overcome.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "Credit average or above; no barrier here.",
      },
      deadline: "2026-08-31",
      dateDiscovered: "2026-08-16",
      summary:
        "Graduate data engineering role supporting mine-site operational data: ingesting sensor and production data into the cloud platform, building pipelines in Azure Data Factory and Databricks, and supporting reporting for operations teams. Rotational, with site visits.",
      whyFit: [
        "Data engineering stack (Azure, Databricks, Spark) matches the direction the CV is heading.",
        "Operational sensor data at genuine scale.",
        "Salary is above the graduate band average.",
      ],
      gaps: [
        "Citizenship/PR requirement cannot be met.",
        "Newcastle base with site travel.",
      ],
      submit: ["Online application", "CV", "Transcript", "Work-rights evidence"],
      assessment: [
        "Online assessment",
        "Video interview",
        "Assessment centre in Newcastle",
      ],
      applicationUrl: "https://www.whitehavencoal.com.au/careers/",
      cvStrategy:
        "Not applicable while the citizenship requirement stands. Keep the record for the stack reference — the Azure/Databricks skill list is a useful template for other data engineering applications.",
      suggestedTailoredSummary: "Not drafted — role is blocked on eligibility.",
      suggestedCvBullets: [],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle: "N/A — do not apply while the PR requirement stands.",
      applicationQuestions: [],
      interviewThemes: [],
      sourceNotes: "Eligibility blocker detected in the posting text (citizens/PR only).",
    },
    {
      id: "ey-graduate-international-eoi",
      track: "graduate",
      company: "EY",
      title: "Graduate Program — International Student EOI",
      location: "Sydney, NSW",
      employmentType: "Graduate Program",
      roleType: "Data Science",
      salary: null,
      priority: "worth-applying",
      fitScore: 7,
      chance: "reasonable",
      visaFit: {
        level: "eligible",
        hardRequirement: false,
        note: "This is the dedicated international-student expression-of-interest pathway — visa status is the point of the stream, not a barrier.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "Credit average guideline. English language evidence is required separately.",
      },
      deadline: "2026-09-30",
      dateDiscovered: "2026-08-12",
      summary:
        "Expression of interest for the technology consulting graduate intake, run as a separate stream for international students. Submitting the EOI puts the profile in front of recruiters ahead of the main intake, but the form requires English test evidence (IELTS / PTE / equivalent) uploaded at submission.",
      whyFit: [
        "Purpose-built for international students — no working-rights guessing.",
        "Big-four consulting brand with a data & analytics practice.",
        "Early EOI means being in the pool before the main intake opens.",
      ],
      gaps: [
        "English test evidence not yet available — the only thing holding the submission.",
        "Consulting assessment processes are long and heavily competitive.",
      ],
      submit: [
        "EOI form",
        "CV",
        "Academic transcript",
        "English test result — IELTS / PTE / equivalent",
      ],
      assessment: [
        "EOI review",
        "Online assessments (numerical, situational judgement)",
        "Digital interview",
        "Assessment centre / superday",
      ],
      applicationUrl: "https://www.ey.com/en_au/careers/students",
      cvStrategy:
        "Consulting-format CV: outcomes and stakeholders first, technology second. Include leadership, volunteering or society roles — these are scored explicitly in graduate consulting processes.",
      suggestedTailoredSummary:
        "Data and analytics graduate interested in technology consulting: solving client data problems in short, high-context engagements rather than owning one internal system. Comfortable presenting, and used to working across disciplines.",
      suggestedCvBullets: [
        "Delivered a data project to a fixed deadline for an external stakeholder, presenting results and recommendations directly.",
        "Coordinated a small team across differing schedules and skill levels, keeping the deliverable on track.",
        "Communicated technical findings to a non-technical audience in writing and in person.",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "The EOI form replaces the cover letter, but the free-text motivation field deserves the same care.",
      applicationQuestions: [
        {
          question: "Why consulting, and why EY?",
          suggestedDraft:
            "Consulting front-loads variety: several industries and data environments in the first two years, which is worth more early than depth in one stack. EY's international student stream also signals that the visa conversation is handled up front rather than at offer stage, which matters practically.",
        },
      ],
      interviewThemes: [
        "Case interview basics — structure before answer",
        "Situational judgement and firm values",
        "Explaining technical work to a client",
        "Motivation for consulting over industry",
      ],
      sourceNotes: "English test evidence is a submission requirement, not a later step.",
    },
    {
      id: "usyd-ai-graduate",
      track: "graduate",
      company: "The University of Sydney",
      title: "AI Graduate",
      location: "Camperdown, NSW",
      employmentType: "Full-time",
      roleType: "AI / ML",
      salary: "$83,000 – $90,000 + 17% super",
      priority: "apply-asap",
      fitScore: 9,
      chance: "reasonable",
      visaFit: {
        level: "eligible",
        hardRequirement: false,
        note: "University roles routinely accept post-study work visas, and the institution sponsors where needed.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "Relevant degree required; no WAM cut-off stated. Being a recent graduate of the institution is a mild advantage.",
      },
      deadline: "2026-08-10",
      dateDiscovered: "2026-08-04",
      summary:
        "Graduate role in the central AI and data team, supporting delivery of AI capability across the university: evaluating and integrating LLM-based tools, building internal prototypes, and supporting responsible-AI review processes. Mix of engineering and governance, 17% superannuation, strong work-life balance.",
      whyFit: [
        "Familiar institution, systems and culture — a genuine advantage in the interview.",
        "LLM/GenAI focus matches recent self-directed project work.",
        "17% super materially lifts the package above the nominal band.",
      ],
      gaps: [
        "Public-sector-style process is slow; expect weeks between stages.",
        "Responsible-AI governance experience is theoretical rather than practical.",
      ],
      submit: [
        "CV",
        "Cover letter addressing the selection criteria",
        "Two referees",
      ],
      assessment: [
        "Application shortlisting",
        "Panel interview (three panellists, criteria-based)",
        "Reference checks",
      ],
      applicationUrl: "https://usyd.wd3.myworkdayjobs.com/",
      cvStrategy:
        "The panel scores against the stated selection criteria, so answer each one under its own heading with a specific example rather than writing a narrative letter.",
      suggestedTailoredSummary:
        "AI graduate with hands-on LLM application experience and an understanding of the governance questions that come with deploying those tools inside a large, risk-aware institution.",
      suggestedCvBullets: [
        "Built a retrieval-augmented prototype over a document set, including evaluation of retrieval quality rather than vibe-checking outputs.",
        "Documented model limitations and failure modes as part of the deliverable.",
        "Worked within an institutional environment and its data-handling constraints.",
      ],
      coverLetterNeeded: true,
      suggestedCoverLetterAngle:
        "One paragraph per selection criterion with a named example for each — that is what panel scoring rewards.",
      applicationQuestions: [],
      interviewThemes: [
        "Criteria-based panel answers in STAR format",
        "Responsible AI: bias, privacy, student data",
        "Working with academic stakeholders",
        "Practical LLM evaluation — how to know it works",
      ],
      sourceNotes: "Panel processes typically take 3–4 weeks to shortlist.",
    },
    {
      id: "suncorp-technology-data-science-graduate",
      track: "graduate",
      company: "Suncorp Group",
      title: "Technology & Data Science Graduate — Data Science stream",
      location: "Sydney, NSW (hybrid)",
      employmentType: "Graduate Program",
      roleType: "Data Science",
      salary: "~$75,000 + super (2027 intake)",
      priority: "apply-asap",
      fitScore: 8,
      chance: "reasonable",
      visaFit: {
        level: "unclear",
        hardRequirement: false,
        note: "Program asks for work rights covering the full two-year rotation. A 485 following the December 2026 completion may not cover both years — raise it before the assessment centre rather than at offer.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "Credit average guideline, already met.",
      },
      deadline: "2026-08-25",
      deadlineNote: "Criteria assessment must be completed by this date",
      dateDiscovered: "2026-07-30",
      summary:
        "Two-year rotational graduate program across technology and data, applied to the data science stream. Rotations cover pricing, claims analytics and customer data science within a large insurance group.",
      whyFit: [
        "Data science stream in a large insurer — a direct route into pricing and claims modelling.",
        "Structured rotations with a defined cohort and mentoring.",
        "Already past the application stage, so momentum matters more than fit now.",
      ],
      gaps: [
        "Large, competitive cohort at assessment-centre stage.",
        "Working-rights coverage for the full two years still needs confirming.",
        "Limited insurance domain vocabulary going into the interview stages.",
      ],
      submit: [
        "Online application",
        "Online criteria assessment",
        "Academic transcript",
      ],
      assessment: [
        "Application review",
        "Criteria / online assessment — timed",
        "Recorded video interview",
        "Virtual assessment centre — group exercise and individual interview",
      ],
      applicationUrl: "https://www.suncorpgroup.com.au/careers/graduates",
      cvStrategy:
        "The CV is locked in for this application. Prep effort now goes into the assessment rather than the document — but refresh the insurance vocabulary (premium, claims frequency, severity, loss ratio) before the video interview.",
      suggestedTailoredSummary:
        "Data science graduate targeting insurance analytics, where pricing and claims models translate directly into commercial outcomes and there is a long history of statistical rigour to learn from.",
      suggestedCvBullets: [
        "Applied classification and regression models to imbalanced, real-world datasets with an emphasis on interpretability.",
        "Communicated model assumptions and limitations alongside results.",
        "Delivered analysis under deadline as part of a small team.",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "Not required for the graduate program — the assessments carry the weight.",
      applicationQuestions: [
        {
          question: "What attracts you to insurance?",
          suggestedDraft:
            "Insurance is priced on models, so analytical work is the product rather than a support function. Claims and pricing data are also unusually rich and long-running, which means the questions go deeper than a typical customer analytics role.",
        },
      ],
      interviewThemes: [
        "Situational judgement — values and customer focus",
        "Group exercise: contribute and include others",
        "Basic insurance concepts: frequency, severity, loss ratio",
        "Explaining a model to a claims manager",
      ],
      sourceNotes: "Timed online assessment; practice numerical and situational tests beforehand.",
    },

    // -----------------------------------------------------------------------
    // Part-time / income track
    //
    // Scored on completely different criteria from the graduate roles above:
    // commute, realistic availability, hourly pay, casual/part-time status,
    // weekend and evening flexibility, how fast the application is, and whether
    // prior retail experience is required. A 9 here is not a 9 above.
    // -----------------------------------------------------------------------
    {
      id: "arc-unsw-retail-assistant",
      track: "part-time",
      company: "Arc @UNSW",
      title: "Retail Assistant — Arc Retail",
      location: "Kensington, NSW (UNSW campus)",
      employmentType: "Part-time",
      roleType: "Campus",
      salary: "$28.50/hr casual + penalty rates",
      priority: "apply-asap",
      fitScore: 9,
      chance: "strong",
      partTime: {
        hourlyPay: "$28.50/hr casual + penalty rates",
        commute: "On campus — already there for classes, no extra travel",
        shiftPattern: "Casual — 2–3 shifts per week, rostered around your timetable",
        weekendEvening: true,
        experienceRequired:
          "No prior retail experience required; existing Arc volunteering is directly relevant",
        withinVisaHours: true,
        applicationEffort: "quick",
      },
      visaFit: {
        level: "eligible",
        hardRequirement: false,
        note: "Student Visa (subclass 500) work rights are standard for campus roles. Rostered hours sit well inside the 48-hour fortnight cap.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "No academic requirement — you must be a currently enrolled UNSW student, which you are.",
      },
      deadline: "2026-08-28",
      dateDiscovered: "2026-08-21",
      summary:
        "Casual retail assistant in the Arc campus store: serving students, restocking, merchandising and point-of-sale. Rosters are built around class timetables and the store closes with campus hours, so no late-night trading.",
      whyFit: [
        "Already volunteering with Arc at Food Hub and Checkpoint — known to the organisation and the environment.",
        "Zero commute cost: shifts slot between classes on the same campus.",
        "Roster is explicitly built around student timetables.",
      ],
      gaps: [
        "No paid retail experience — all customer-facing work so far has been volunteer.",
        "Campus store closes over the summer break, so hours drop off in December.",
      ],
      submit: [
        "Short online form",
        "Retail CV (1–2 pages)",
        "Student number and enrolment confirmation",
      ],
      assessment: ["Application review", "Informal interview with the store supervisor"],
      applicationUrl: "https://www.arc.unsw.edu.au/employment",
      cvStrategy:
        "Lead with the Arc volunteering — same organisation, same kind of work. Keep the data projects off entirely; they add length without adding relevance. One page is enough.",
      suggestedTailoredSummary:
        "Current UNSW student and Arc volunteer with hands-on customer service experience at Food Hub and Checkpoint, looking for casual retail hours that fit around a Data Science timetable.",
      suggestedCvBullets: [
        "Assisted 1000+ customers per shift with product recommendations and responsive customer service in a fast-paced retail environment",
        "Replenished stock, organised displays, tagged products, and maintained visual presentation standards",
        "Completed 70+ service hours for official AHEGS recognition",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "No cover letter needed. If there is a free-text box, use two sentences: existing Arc volunteering, and availability across weekdays between classes.",
      applicationQuestions: [
        {
          question: "What is your availability?",
          suggestedDraft:
            "Available weekdays between classes and across weekends, including late trading and public holidays. Student visa conditions cap me at 48 hours per fortnight, which comfortably covers a 2–3 shift week.",
        },
      ],
      interviewThemes: [
        "Handling a busy counter during lunch rush",
        "Existing Arc volunteering — what you actually did",
        "Availability and timetable clashes",
      ],
      sourceNotes: "Campus employer; applications reviewed weekly during term.",
    },
    {
      id: "woolworths-campsie-customer-service",
      track: "part-time",
      company: "Woolworths",
      title: "Customer Service Team Member",
      location: "Campsie, NSW",
      employmentType: "Part-time",
      roleType: "Customer Service",
      salary: "$26.80/hr + weekend and evening penalties",
      priority: "apply-asap",
      fitScore: 8,
      chance: "strong",
      partTime: {
        hourlyPay: "$26.80/hr + weekend and evening penalties",
        commute: "~10 minute walk from home in Campsie",
        shiftPattern: "Part-time — 12–20 hours per week across a rotating roster",
        weekendEvening: true,
        experienceRequired: "No experience required — full training provided",
        withinVisaHours: true,
        applicationEffort: "quick",
      },
      visaFit: {
        level: "eligible",
        hardRequirement: false,
        note: "Student Visa (subclass 500) accepted. 12–20 hours per week is at the top of the 48-hour fortnight cap — check the roster does not push over it in a busy fortnight.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "No academic requirement.",
      },
      deadline: null,
      deadlineNote: "Rolling — stores hire continuously",
      dateDiscovered: "2026-08-19",
      summary:
        "Front-of-store customer service in a large supermarket: checkouts, self-serve assistance, online order pick-packing and floor replenishment. Rotating roster with guaranteed part-time hours rather than casual.",
      whyFit: [
        "Ten minutes from home — the shortest commute of anything on the board.",
        "Guaranteed part-time hours rather than casual, so income is predictable.",
        "No prior paid retail experience required.",
      ],
      gaps: [
        "Rotating roster may clash with fixed class times — needs a firm availability conversation up front.",
        "20 hours a week sits close to the 48-hour fortnight visa cap.",
      ],
      submit: ["Online application form", "Retail CV", "Availability grid"],
      assessment: [
        "Online application and availability form",
        "Digital interview (recorded, ~15 min)",
        "Store manager interview",
      ],
      applicationUrl: "https://wowcareers.com.au/",
      cvStrategy:
        "One page, customer service first. Use the Arc Food Hub and Checkpoint bullets — high customer volumes are exactly what a supermarket is checking for. No projects, no technical skills section.",
      suggestedTailoredSummary:
        "Customer-focused student with volunteer retail and customer service experience in high-volume campus environments, available across weekends, evenings and public holidays.",
      suggestedCvBullets: [
        "Assisted 1000+ customers per shift with product recommendations and responsive customer service in a fast-paced retail environment",
        "Maintained store cleanliness, product presentation, and stock organisation during busy trading periods",
        "Collaborated with volunteer team of 30 people to set up, run, and pack down distribution hub",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle: "Not required — the availability grid does the work.",
      applicationQuestions: [
        {
          question: "Describe a time you helped a difficult customer.",
          suggestedDraft:
            "At the Arc Food Hub a student arrived after stock had run out and was upset. I explained what was left, offered an alternative, and told them the restock time so they could come back — they did. Being specific and honest defused it faster than apologising would have.",
        },
      ],
      interviewThemes: [
        "Availability and roster flexibility",
        "Handling a queue under time pressure",
        "Why supermarket retail",
      ],
      sourceNotes: "High-volume employer; digital interview stage is automated.",
    },
    {
      id: "uniqlo-sales-assistant-cbd",
      track: "part-time",
      company: "UNIQLO",
      title: "Sales Assistant (Casual)",
      location: "Sydney CBD, NSW",
      employmentType: "Part-time",
      roleType: "Sales Assistant",
      salary: "$27.10/hr + penalty rates",
      priority: "worth-applying",
      fitScore: 7,
      chance: "reasonable",
      partTime: {
        hourlyPay: "$27.10/hr + penalty rates",
        commute: "~35 minutes by train from Campsie",
        shiftPattern: "Casual — minimum two shifts per week, one weekend day required",
        weekendEvening: true,
        experienceRequired: "Retail experience preferred but not required",
        withinVisaHours: true,
        applicationEffort: "standard",
      },
      visaFit: {
        level: "eligible",
        hardRequirement: false,
        note: "Student Visa (subclass 500) accepted for casual retail. Two shifts per week sits well inside the 48-hour fortnight cap.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "No academic requirement.",
      },
      deadline: null,
      deadlineNote: "Rolling — recruits ahead of peak trading",
      dateDiscovered: "2026-08-20",
      summary:
        "Casual sales assistant on a busy CBD flagship floor: customer service, fitting room support, sizing and styling advice, stock replenishment and visual standards. Strong emphasis on service scripts and store presentation.",
      whyFit: [
        "Styling, sizing and merchandising language on the retail CV maps directly onto this role.",
        "Penalty rates on weekends make a small number of shifts worth more.",
        "Large employer — a reference from here helps every later retail application.",
      ],
      gaps: [
        "35-minute each-way commute eats into a short shift.",
        "Prefers prior paid retail experience; yours is volunteer.",
        "CBD flagship rosters are competitive around exam periods.",
      ],
      submit: ["Online application", "Retail CV", "Availability declaration"],
      assessment: [
        "Online application",
        "Group assessment / store trial",
        "Manager interview",
      ],
      applicationUrl: "https://www.uniqlo.com/au/en/company/careers",
      cvStrategy:
        "Retail CV with the merchandising and presentation bullets pulled to the top. Keep the 'luxury customer service mindset' and styling language — it matches how this employer writes about the floor.",
      suggestedTailoredSummary:
        "Customer-focused retail assistant with experience in fast-paced, high-volume service environments, comfortable with product recommendations, sizing support and maintaining visual merchandising standards.",
      suggestedCvBullets: [
        "Replenished stock, organised displays, tagged products, and maintained visual presentation standards",
        "Delivered friendly customer service to 500+ students daily while assisting with product selection and recommendations",
        "Coordinated merchandise design and promotional campaigns, supporting customer engagement and product sales during student events",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "Not required. The group assessment matters far more — prepare to be visibly helpful rather than quietly competent.",
      applicationQuestions: [
        {
          question: "Why do you want to work for this brand?",
          suggestedDraft:
            "The floor runs on consistency — sizing, folding, replenishment and service all follow a standard, and I like environments where the standard is explicit. My volunteer retail work was in a similar high-volume setting where presentation slipped the moment anyone stopped paying attention.",
        },
      ],
      interviewThemes: [
        "Group assessment: be helpful and visible",
        "Sizing and styling advice for an unsure customer",
        "Weekend and peak-trading availability",
      ],
      sourceNotes: "Group assessment stage; hires in batches ahead of peak trading.",
    },
    {
      id: "unsw-student-ambassador",
      track: "part-time",
      company: "UNSW Sydney",
      title: "Casual Student Ambassador",
      location: "Kensington, NSW (UNSW campus)",
      employmentType: "Part-time",
      roleType: "Campus",
      salary: "$41.25/hr casual",
      priority: "worth-applying",
      fitScore: 7,
      chance: "reasonable",
      partTime: {
        hourlyPay: "$41.25/hr casual — the highest rate on the part-time board",
        commute: "On campus",
        shiftPattern: "Casual — event-based, bursty around open days and orientation",
        weekendEvening: true,
        experienceRequired:
          "Current UNSW student with confident public speaking; no retail experience needed",
        withinVisaHours: true,
        applicationEffort: "long",
      },
      visaFit: {
        level: "eligible",
        hardRequirement: false,
        note: "University casual employment, Student Visa (subclass 500) standard. Event-based hours are irregular — track the fortnightly total during open-day periods.",
      },
      gradeRequirement: {
        level: "eligible",
        hardRequirement: false,
        note: "Must be a currently enrolled UNSW student in good standing. No WAM requirement published.",
      },
      deadline: "2026-09-04",
      dateDiscovered: "2026-08-15",
      summary:
        "Casual ambassador role representing the university at open days, campus tours, school visits and orientation events. Work is talking to prospective students and families, running activities and staffing information desks.",
      whyFit: [
        "Highest hourly rate of any part-time role on the board, on campus.",
        "Marketing subcommittee and Food Hub experience both demonstrate student-facing communication.",
        "Event work clusters on weekends, so it rarely clashes with classes.",
      ],
      gaps: [
        "Hours are irregular and seasonal — not reliable income between event peaks.",
        "Application is the longest on the part-time board: written responses plus a group interview.",
      ],
      submit: [
        "Online application",
        "CV",
        "Two written responses (200 words each)",
        "Enrolment confirmation",
      ],
      assessment: [
        "Written application",
        "Group interview / activity",
        "Compulsory paid training day",
      ],
      applicationUrl: "https://www.unsw.edu.au/employment",
      cvStrategy:
        "Mix the two families: keep the retail customer-service bullets, but add the Marketing Subcommittee work with the reach and growth metrics — this role is student engagement, so both halves count.",
      suggestedTailoredSummary:
        "UNSW Data Science student and Arc volunteer with experience engaging large student audiences, from campus service to running social media campaigns for a student society.",
      suggestedCvBullets: [
        "Managed Facebook & Instagram content strategy, achieving +300% reach and +160% follower growth",
        "Delivered friendly customer service to 500+ students daily while assisting with product selection and recommendations",
        "Collaborate with a 5-member team to deliver campaigns on schedule, strengthening engagement outcomes",
      ],
      coverLetterNeeded: false,
      suggestedCoverLetterAngle:
        "No letter, but the two written responses carry the same weight. Draft them properly — specific examples of talking to strangers beat enthusiasm.",
      applicationQuestions: [
        {
          question: "Why do you want to represent UNSW?",
          suggestedDraft:
            "I arrived as an international student and the people who answered my questions early made a disproportionate difference. Open days are where that happens for the next intake, and I can speak to the international student experience specifically rather than in general terms.",
        },
        {
          question: "Describe a time you communicated with a large group.",
          suggestedDraft:
            "Running the Food Hub distribution shifts meant explaining the same process to a queue of hundreds of students, most of them in a hurry. I learnt to lead with the one thing they needed to do next rather than the full explanation.",
        },
      ],
      interviewThemes: [
        "Group activity — include others rather than dominate",
        "Talking to a nervous prospective student and their parent",
        "Availability across open days and orientation weeks",
      ],
      sourceNotes: "Seasonal intake; training day is compulsory and paid.",
    },
  ],
};
