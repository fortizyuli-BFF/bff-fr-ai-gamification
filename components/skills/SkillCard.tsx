"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Member, SkillProfile } from "@/lib/airtable";
import { SkillPolygon, SkillPolygonOutline } from "./SkillPolygon";
import { SkillSurvey } from "./SkillSurvey";

type Props = {
  memberId: string;
  profile: SkillProfile | null;
  onSaved: (member: Member) => void;
};

export function SkillCard({ memberId, profile, onSaved }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5"
      aria-labelledby="skill-card-title"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          id="skill-card-title"
          className="font-display text-2xl text-foreground"
        >
          Your skill polygon
        </h2>
        {profile && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Edit polygon →
          </button>
        )}
      </div>

      {profile ? (
        <div className="grid items-center gap-6 sm:grid-cols-[260px_1fr]">
          <div className="flex justify-center">
            <SkillPolygon
              count={profile.count}
              skills={profile.skills}
              size={260}
              showLabels
            />
          </div>
          <ul className="grid gap-1.5 text-sm">
            {profile.skills.map((s, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-3 border-b border-dashed border-border/60 py-1.5"
              >
                <span className="truncate text-foreground/80">{s.name}</span>
                <span className="font-display text-lg text-primary">
                  {s.score}
                  <span className="text-xs text-muted-foreground"> /10</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-primary/40 bg-[var(--bff-gold-wash)] p-5 sm:flex-row sm:items-center">
          <div className="flex-shrink-0">
            <SkillPolygonOutline count={6} size={72} />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg text-foreground">
              FIFA-style stat sheet, BFF edition.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick 5 or 6 skills, score yourself 1–10, get a personal polygon.
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>Build mine</Button>
        </div>
      )}

      {open && (
        <SkillSurvey
          open={open}
          onOpenChange={setOpen}
          memberId={memberId}
          initial={profile}
          onSaved={onSaved}
        />
      )}
    </section>
  );
}
