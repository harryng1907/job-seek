"use client";

import type { ComposedResume } from "@/types/resume";

/**
 * Live preview.
 *
 * Rendered as a light "sheet" rather than in the dashboard's dark palette — it
 * is a document, and it should look like the thing that gets sent. Which
 * contact details appear is a property of the CV family: the data CV prints a
 * LinkedIn URL, the retail CV prints a suburb instead.
 */
export function CvPreview({ resume }: { resume: ComposedResume }) {
  const { profile, headline, contactFields, sections } = resume;

  const contact = [
    contactFields.includes("phone") ? profile.phone : null,
    contactFields.includes("email") ? profile.email : null,
    contactFields.includes("location") ? profile.location : null,
  ].filter(Boolean);

  return (
    <div className="rounded-xl bg-white p-6 text-zinc-900 shadow-lg shadow-black/30 sm:p-8">
      <header className="border-b border-zinc-300 pb-3">
        <h1 className="text-xl font-semibold tracking-tight">
          {profile.name}
          {headline ? (
            <span className="font-normal text-zinc-500"> — {headline}</span>
          ) : null}
        </h1>
        {contact.length ? (
          <p className="mt-2 text-[11px] text-zinc-600">{contact.join("  ·  ")}</p>
        ) : null}
        {contactFields.includes("links") && profile.links.length ? (
          <p className="mt-1 text-[11px] text-zinc-600">
            {profile.links.map((link) => `${link.label}: ${link.url}`).join("  ·  ")}
          </p>
        ) : null}
      </header>

      {sections.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400">
          Everything is switched off — include a section to see it here.
        </p>
      ) : null}

      {sections.map((section) => (
        <section key={section.id} className="mt-5">
          <h2 className="border-b border-zinc-200 pb-1 text-[11px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            {section.label}
          </h2>

          {section.text ? (
            <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-line text-zinc-700">
              {section.text}
            </p>
          ) : null}

          {section.items?.map((item) => (
            <article key={item.id} className="mt-3">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[13px] font-semibold text-zinc-900">{item.title}</h3>
                {item.dates ? (
                  <span className="shrink-0 text-[11px] text-zinc-500">{item.dates}</span>
                ) : null}
              </div>
              {item.organisation ? (
                <p className="text-[12px] text-zinc-600 italic">
                  {item.organisation}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
              ) : null}
              {item.bullets.length ? (
                <ul className="mt-1 space-y-1">
                  {item.bullets
                    .filter((bullet) => bullet.trim())
                    .map((bullet, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-[12.5px] leading-relaxed text-zinc-700"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                </ul>
              ) : null}
            </article>
          ))}

          {section.skillGroups ? (
            <dl className="mt-2 space-y-1">
              {section.skillGroups.map((group) => (
                <div key={group.id} className="flex gap-2 text-[12.5px] leading-relaxed">
                  <dt className="shrink-0 font-medium text-zinc-900">{group.label}:</dt>
                  <dd className="text-zinc-700">{group.skills.join(", ")}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ))}
    </div>
  );
}
