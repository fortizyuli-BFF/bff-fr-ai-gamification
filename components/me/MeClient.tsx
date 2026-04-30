"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/avatar/Avatar";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { ChallengePath } from "@/components/challenges/ChallengePath";
import { CountdownToFriday } from "@/components/reveal/CountdownToFriday";
import { WeekComingSoon } from "@/components/reveal/WeekComingSoon";
import { PointsPhilosophy } from "@/components/progress/PointsPhilosophy";
import { SkillCard } from "@/components/skills/SkillCard";
import type { Challenge, Completion, Member } from "@/lib/airtable";
import { getSessionMemberId, markOnboarded } from "@/lib/session";

type Props = {
  weekLaunchAt: string;
  weekTheme: string;
  weekNumber: number;
  challenges: Challenge[];
  hasNextWeekDefined: boolean;
};

type ApiResponse = {
  member: Member;
  completions: Completion[];
  points: Record<string, number>;
};

export function MeClient({
  weekLaunchAt,
  weekTheme,
  weekNumber,
  challenges,
  hasNextWeekDefined,
}: Props) {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [points, setPoints] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getSessionMemberId();
    if (!id) {
      router.replace("/");
      return;
    }
    fetch(`/api/members/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("missing");
        return r.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        setMember(data.member);
        setCompletions(data.completions ?? []);
        setPoints(data.points ?? {});
        if (!data.member.avatar.head) {
          router.replace("/me/avatar?first=1");
          return;
        }
        markOnboarded();
        setLoading(false);
      })
      .catch(() => {
        router.replace("/");
      });
  }, [router]);

  const completedIds = useMemo(
    () => new Set(completions.map((c) => c.challengeId)),
    [completions]
  );

  const weekPoints = points[`week${weekNumber}`] ?? 0;
  const hasLaunched = new Date(weekLaunchAt).getTime() <= Date.now();

  const onComplete = useCallback(
    async (
      challengeId: string,
      proof: { proofText?: string; proofUrl?: string }
    ) => {
      if (!member) throw new Error("Not signed in");
      if (completedIds.has(challengeId)) return;

      const optimistic: Completion = {
        id: `optimistic-${challengeId}`,
        memberId: member.id,
        challengeId,
        completedAt: new Date().toISOString(),
        proofText: proof.proofText ?? null,
        proofUrl: proof.proofUrl ?? null,
        verifiedByAdmin: false,
        adminNotes: null,
        reactions: {},
      };
      setCompletions((prev) => [...prev, optimistic]);

      try {
        const res = await fetch("/api/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: member.id,
            challengeId,
            ...proof,
          }),
        });
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({
            error: "Couldn't save that one — try again",
          }));
          throw new Error(error || "Couldn't save");
        }
        const { completion } = (await res.json()) as { completion: Completion };
        setCompletions((prev) =>
          prev.map((c) => (c.id === optimistic.id ? completion : c))
        );
        const ch = challenges.find((c) => c.id === challengeId);
        if (ch) {
          setPoints((prev) => ({
            ...prev,
            [`week${ch.weekNumber}`]: (prev[`week${ch.weekNumber}`] ?? 0) +
              ch.points,
          }));
        }
      } catch (err) {
        setCompletions((prev) => prev.filter((c) => c.id !== optimistic.id));
        throw err;
      }
    },
    [member, completedIds, challenges]
  );

  if (loading || !member) {
    return (
      <>
        <BrandHeader />
        <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-20">
          <p className="text-sm text-muted-foreground">Loading your table…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <BrandHeader memberName={member.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10 flex items-center gap-5 rounded-2xl border border-border bg-card p-5">
          <Link
            href="/me/avatar"
            className="flex-shrink-0 rounded-xl transition hover:opacity-90"
            aria-label="Edit your character"
          >
            <div className="flex h-24 w-20 items-end justify-center overflow-hidden">
              <Avatar
                head={member.avatar.head}
                shirt={member.avatar.shirt}
                pants={member.avatar.pants}
                shoes={member.avatar.shoes}
                primaryColor={member.avatar.primaryColor}
                size={80}
              />
            </div>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              You are
            </p>
            <h1 className="font-display text-2xl text-foreground sm:text-3xl">
              {member.name}
              {member.isAdmin && ", admin"}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              FR AI pioneer · {member.role ?? "Team member"}
            </p>
            <p
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-2.5 py-1 font-display-caps text-[10px] text-foreground sm:hidden"
              style={{ backgroundColor: "var(--bff-gold-wash)" }}
            >
              <span className="font-display text-[13px] leading-none">
                {weekPoints}
              </span>
              <span className="text-muted-foreground">
                pts · week {weekNumber}
              </span>
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-display text-3xl text-foreground">{weekPoints}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              points · week {weekNumber}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <CountdownToFriday
            launchAt={weekLaunchAt}
            theme={weekTheme}
            weekNumber={weekNumber}
          />
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-foreground">
                Your Week {weekNumber} path
              </h2>
              <Link
                href="/me/avatar"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Edit character →
              </Link>
            </div>
            <ChallengePath
              challenges={challenges}
              hasLaunched={hasLaunched}
              weekNumber={weekNumber}
              weekTheme={weekTheme}
              completedIds={completedIds}
              onComplete={onComplete}
            />
          </div>

          <SkillCard
            memberId={member.id}
            profile={member.skillProfile}
            onSaved={(m) => setMember(m)}
          />

          {!hasNextWeekDefined && <WeekComingSoon weekNumber={weekNumber + 1} />}

          <PointsPhilosophy />
        </div>
      </main>
    </>
  );
}
