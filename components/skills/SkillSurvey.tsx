"use client";

import { useMemo, useState, useTransition } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Member, SkillProfile } from "@/lib/airtable";
import { SkillPolygon, SkillPolygonOutline } from "./SkillPolygon";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  initial: SkillProfile | null;
  onSaved: (member: Member) => void;
};

type Skill = { name: string; score: number };
type Count = 5 | 6;

const GOLD_CONFETTI = ["#CB9D6B", "#F0C69A", "#ffffff"];

function emptySkills(n: Count, base: Skill[] = []): Skill[] {
  return Array.from({ length: n }, (_, i) =>
    base[i] ?? { name: "", score: 5 }
  );
}

export function SkillSurvey({
  open,
  onOpenChange,
  memberId,
  initial,
  onSaved,
}: Props) {
  const [step, setStep] = useState(0);
  const [count, setCount] = useState<Count | null>(initial?.count ?? null);
  const [skills, setSkills] = useState<Skill[]>(
    initial ? emptySkills(initial.count, initial.skills) : []
  );
  const [isPending, startTransition] = useTransition();

  const totalSteps = count ? count + 2 : 1;

  const pickCount = (n: Count) => {
    setCount(n);
    setSkills((prev) => emptySkills(n, prev));
    setStep(1);
  };

  const updateSkill = (i: number, patch: Partial<Skill>) => {
    setSkills((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  };

  const canAdvance = useMemo(() => {
    if (step === 0) return count !== null;
    if (count && step >= 1 && step <= count) {
      const s = skills[step - 1];
      return s && s.name.trim().length > 0 && s.score >= 1 && s.score <= 10;
    }
    return true;
  }, [step, count, skills]);

  const submit = () => {
    if (!count) return;
    startTransition(async () => {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, count, skills }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Couldn't save your polygon");
        return;
      }
      const data = (await res.json()) as { member: Member };
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { x: 0.5, y: 0.55 },
        colors: GOLD_CONFETTI,
        gravity: 0.9,
        ticks: 180,
      });
      toast.success("Polygon locked in");
      onSaved(data.member);
      onOpenChange(false);
    });
  };

  const previewSkills = useMemo<Skill[]>(() => {
    if (!count) return [];
    return skills.map((s, i) => ({
      name: s.name.trim() || `Skill ${i + 1}`,
      score:
        step === 0 || (step >= 1 && step <= count && step - 1 < i) ? 0 : s.score,
    }));
  }, [count, skills, step]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle className="font-display text-xl">
          {initial ? "Re-do your polygon" : "Build your skill polygon"}
        </DialogTitle>
        <DialogDescription>
          {step === 0
            ? "Pick how many skills define you."
            : count && step <= count
              ? `Skill ${step} of ${count} — name it and score it 1–10.`
              : "Looking sharp? Save it."}
        </DialogDescription>

        <div className="grid gap-6 sm:grid-cols-[1fr_240px]">
          <div className="min-h-[200px]">
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {([5, 6] as Count[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => pickCount(n)}
                    className={cn(
                      "group flex flex-col items-center gap-3 rounded-2xl border-2 bg-card p-5 transition",
                      count === n
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <SkillPolygonOutline count={n} size={88} />
                    <div className="text-center">
                      <p className="font-display text-lg">
                        {n === 5 ? "Pentagon" : "Hexagon"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {n} skills
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {count && step >= 1 && step <= count && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor={`skill-name-${step}`} className="text-sm">
                    Skill name
                  </Label>
                  <Input
                    id={`skill-name-${step}`}
                    autoFocus
                    value={skills[step - 1]?.name ?? ""}
                    onChange={(e) =>
                      updateSkill(step - 1, { name: e.target.value })
                    }
                    placeholder="e.g. Donor research, Claude prompting…"
                    maxLength={80}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <Label htmlFor={`skill-score-${step}`} className="text-sm">
                      Score
                    </Label>
                    <span className="font-display text-2xl text-primary">
                      {skills[step - 1]?.score ?? 5}
                      <span className="text-sm text-muted-foreground">
                        {" "}
                        / 10
                      </span>
                    </span>
                  </div>
                  <input
                    id={`skill-score-${step}`}
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={skills[step - 1]?.score ?? 5}
                    onChange={(e) =>
                      updateSkill(step - 1, {
                        score: Number(e.target.value),
                      })
                    }
                    className="h-2 w-full cursor-pointer"
                    style={{ accentColor: "var(--bff-gold)" }}
                  />
                  <div className="mt-1 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>Just starting</span>
                    <span>Pro</span>
                  </div>
                </div>
              </div>
            )}

            {count && step === count + 1 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Here&apos;s your polygon. You can re-do it any time.
                </p>
                <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
                  {skills.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-3 border-b border-dashed border-border/60 py-1"
                    >
                      <span className="truncate text-foreground/80">
                        {s.name || `Skill ${i + 1}`}
                      </span>
                      <span className="font-display text-base text-primary">
                        {s.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="hidden items-center justify-center sm:flex">
            {count && (
              <SkillPolygon
                count={count}
                skills={previewSkills}
                size={240}
                showLabels
              />
            )}
          </div>
        </div>

        <div className="-mx-4 -mb-4 flex items-center justify-between gap-2 rounded-b-xl border-t bg-muted/50 p-4">
          <span className="text-xs text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </span>
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={isPending}
              >
                Back
              </Button>
            )}
            {count && step === count + 1 ? (
              <Button onClick={submit} disabled={isPending}>
                {isPending ? "Saving…" : "Save polygon"}
              </Button>
            ) : (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
