"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles, Unlock } from "lucide-react";
import type { Challenge } from "@/lib/airtable";
import { cn } from "@/lib/utils";
import { ChallengeDrawer } from "./ChallengeDrawer";
import { WeekUnlockCeremony } from "@/components/reveal/WeekUnlockCeremony";
import {
  hasSeenWeekUnlock,
  markSeenWeekUnlock,
} from "@/lib/session";

type Props = {
  challenges: Challenge[];
  hasLaunched: boolean;
  weekNumber: number;
  weekTheme: string;
  completedIds?: Set<string>;
};

export function ChallengePath({
  challenges,
  hasLaunched,
  weekNumber,
  weekTheme,
  completedIds,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [ceremonyOpen, setCeremonyOpen] = useState(false);

  // Auto-trigger ceremony on first visit after real launch
  useEffect(() => {
    if (!hasLaunched) return;
    if (hasSeenWeekUnlock(weekNumber)) return;
    setCeremonyOpen(true);
  }, [hasLaunched, weekNumber]);

  const setupTier = challenges.filter((c) => c.tier === "Setup");
  const applyTier = challenges.filter((c) => c.tier === "Apply");
  const open = openId
    ? challenges.find((c) => c.id === openId) ?? null
    : null;

  const dismissCeremony = () => {
    setCeremonyOpen(false);
    markSeenWeekUnlock(weekNumber);
  };

  return (
    <>
      {!hasLaunched && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--bff-gold-wash)" }}
            >
              <Sparkles
                className="h-4 w-4"
                style={{ color: "var(--bff-gold)" }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Curious what Friday looks like?
              </p>
              <p className="text-xs text-muted-foreground">
                Preview the unlock animation — doesn&apos;t actually open the
                week.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCeremonyOpen(true)}
            className="rounded-full border border-foreground/20 bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-widest text-background transition hover:opacity-90"
          >
            Preview drop
          </button>
        </div>
      )}

      <div className="space-y-10">
        <TierRow
          label="Tier 1 · Setup"
          subtitle="Enabling moves. 10 pts each."
          challenges={setupTier}
          hasLaunched={hasLaunched}
          completedIds={completedIds}
          onOpen={(id) => setOpenId(id)}
        />
        <TierRow
          label="Tier 2 · Apply"
          subtitle="Real reps during the week. 25 pts each."
          challenges={applyTier}
          hasLaunched={hasLaunched}
          completedIds={completedIds}
          onOpen={(id) => setOpenId(id)}
        />
      </div>

      <ChallengeDrawer
        challenge={open}
        hasLaunched={hasLaunched}
        onClose={() => setOpenId(null)}
      />

      <WeekUnlockCeremony
        open={ceremonyOpen}
        weekNumber={weekNumber}
        theme={weekTheme}
        challenges={challenges}
        onDismiss={dismissCeremony}
      />
    </>
  );
}

function TierRow({
  label,
  subtitle,
  challenges,
  hasLaunched,
  completedIds,
  onOpen,
}: {
  label: string;
  subtitle: string;
  challenges: Challenge[];
  hasLaunched: boolean;
  completedIds?: Set<string>;
  onOpen: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <p className="font-display-caps text-[11px] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c, i) => {
          const done = completedIds?.has(c.id) ?? false;
          return (
            <ChallengeNode
              key={c.id}
              challenge={c}
              hasLaunched={hasLaunched}
              done={done}
              index={i}
              onOpen={onOpen}
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
  index,
  onOpen,
}: {
  challenge: Challenge;
  hasLaunched: boolean;
  done: boolean;
  index: number;
  onOpen: (id: string) => void;
}) {
  const locked = !hasLaunched;
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(challenge.id)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 text-left transition",
        locked
          ? "border-border bg-card hover:border-primary/40"
          : done
            ? "border-primary/40 bg-accent/60"
            : "border-border bg-card hover:border-primary/40 hover:shadow-[0_10px_30px_-12px_rgba(203,157,107,0.4)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition",
            locked
              ? "bg-muted text-muted-foreground"
              : done
                ? "bg-primary text-primary-foreground"
                : "text-primary-foreground"
          )}
          style={
            !locked && !done
              ? { backgroundColor: "var(--bff-gold)" }
              : undefined
          }
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : done ? (
            <span>✓</span>
          ) : (
            `${challenge.points}`
          )}
        </div>
        <span className="font-display-caps text-[10px] text-muted-foreground">
          {challenge.tier}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">
        {challenge.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">
        {locked
          ? "Tap to see the how-to — unlocks for real on Friday."
          : challenge.description || "Tap to see what this is about."}
      </p>

      <div className="mt-4 flex items-center gap-1.5 font-display-caps text-[10px] text-primary opacity-0 transition group-hover:opacity-100">
        {locked ? (
          <>
            <Unlock className="h-3 w-3" />
            See how-to
          </>
        ) : (
          <>Open →</>
        )}
      </div>
    </motion.button>
  );
}
