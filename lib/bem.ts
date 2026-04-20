import type { Challenge, Completion } from "./airtable";

export function hasLaunched(launchAt: string, now: Date = new Date()): boolean {
  return new Date(launchAt).getTime() <= now.getTime();
}

export function pointsForWeek(
  challenges: Challenge[],
  completions: Completion[],
  memberId: string,
  weekNumber: number
): number {
  const weekChallengeIds = new Set(
    challenges.filter((c) => c.weekNumber === weekNumber).map((c) => c.id)
  );
  const mineDeduped = new Set(
    completions
      .filter(
        (c) => c.memberId === memberId && weekChallengeIds.has(c.challengeId)
      )
      .map((c) => c.challengeId)
  );
  const byId = new Map(challenges.map((c) => [c.id, c]));
  return Array.from(mineDeduped).reduce(
    (acc, id) => acc + (byId.get(id)?.points ?? 0),
    0
  );
}

export function weeklyProgress(
  challenges: Challenge[],
  completions: Completion[],
  memberId: string,
  weekNumber: number
): { completed: number; total: number; fraction: number } {
  const weekChallenges = challenges.filter((c) => c.weekNumber === weekNumber);
  const done = new Set(
    completions
      .filter((c) => c.memberId === memberId)
      .map((c) => c.challengeId)
  );
  const completed = weekChallenges.filter((c) => done.has(c.id)).length;
  const total = weekChallenges.length;
  return {
    completed,
    total,
    fraction: total === 0 ? 0 : completed / total,
  };
}

export const AVATAR_PARTS = {
  head: ["h1", "h2", "h3", "h4"],
  shirt: ["s1", "s2", "s3", "s4"],
  pants: ["p1", "p2", "p3", "p4"],
  shoes: ["sh1", "sh2", "sh3", "sh4"],
} as const;

export const DEFAULT_AVATAR = {
  head: "h1",
  shirt: "s1",
  pants: "p1",
  shoes: "sh1",
  primaryColor: "#E86A33",
} as const;

export const SHIRT_COLOURS = [
  "#E86A33",
  "#2F8F7E",
  "#C89B3C",
  "#4E6EB5",
  "#B54E6E",
  "#1A1614",
  "#FAF9F6",
  "#E8934A",
] as const;
