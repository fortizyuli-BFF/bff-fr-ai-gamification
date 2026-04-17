"use client";

import { Lock } from "lucide-react";
import type { Challenge } from "@/lib/airtable";
import { cn } from "@/lib/utils";

type Props = {
  challenges: Challenge[];
  hasLaunched: boolean;
  completedIds?: Set<string>;
};

export function ChallengePath({
  challenges,
  hasLaunched,
  completedIds,
}: Props) {
  const setupTier = challenges.filter((c) => c.tier === "Setup");
  const applyTier = challenges.filter((c) => c.tier === "Apply");

  return (
    <div className="space-y-10">
      <TierRow
        label="Tier 1 · Setup"
        subtitle="Enabling moves. 10 points each."
        challenges={setupTier}
        hasLaunched={hasLaunched}
        completedIds={completedIds}
      />
      <TierRow
        label="Tier 2 · Apply"
        subtitle="Real reps during the week. 25 points each."
        challenges={applyTier}
        hasLaunched={hasLaunched}
        completedIds={completedIds}
      />
    </div>
  );
}

function TierRow({
  label,
  subtitle,
  challenges,
  hasLaunched,
  completedIds,
}: {
  label: string;
  subtitle: string;
  challenges: Challenge[];
  hasLaunched: boolean;
  completedIds?: Set<string>;
}) {
  return (
    <div>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c) => {
          const done = completedIds?.has(c.id) ?? false;
          return (
            <ChallengeNode
              key={c.id}
              challenge={c}
              hasLaunched={hasLaunched}
              done={done}
            />
          );
        })}
      </div>
    </div>
  );
}

function ChallengeNode({
  challenge,
  hasLaunched,
  done,
}: {
  challenge: Challenge;
  hasLaunched: boolean;
  done: boolean;
}) {
  const locked = !hasLaunched;
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 transition",
        locked
          ? "border-dashed border-locked/40 bg-muted/40"
          : done
            ? "border-complete/40 bg-complete/10"
            : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold",
            locked
              ? "bg-locked/10 text-locked"
              : done
                ? "bg-complete text-white"
                : "bg-primary/10 text-primary"
          )}
        >
          {locked ? <Lock className="h-4 w-4" /> : `${challenge.points}`}
        </div>
        <span
          className={cn(
            "text-[10px] uppercase tracking-widest",
            locked ? "text-locked" : "text-muted-foreground"
          )}
        >
          {challenge.tier}
        </span>
      </div>
      <h3
        className={cn(
          "mt-3 text-base font-semibold",
          locked ? "text-foreground/40" : "text-foreground"
        )}
      >
        {challenge.title}
      </h3>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed",
          locked ? "text-foreground/30" : "text-foreground/70"
        )}
      >
        {locked ? "Unlocks Friday at 16:00 London." : challenge.description}
      </p>
    </div>
  );
}
