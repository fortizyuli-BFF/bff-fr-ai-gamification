import Link from "next/link";
import {
  listChallenges,
  listWeeks,
} from "@/lib/airtable";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { CountdownToFriday } from "@/components/reveal/CountdownToFriday";
import { ChallengePath } from "@/components/challenges/ChallengePath";
import { MeClient } from "@/components/me/MeClient";

export const revalidate = 30;

export default async function MePage() {
  const [challenges, weeks] = await Promise.all([
    listChallenges(),
    listWeeks(),
  ]);
  const week = weeks.find((w) => w.weekNumber === 1);
  const weekChallenges = challenges.filter((c) => c.weekNumber === 1);
  if (!week) {
    return (
      <>
        <BrandHeader />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
          <p className="text-muted-foreground">No week seeded yet.</p>
        </main>
      </>
    );
  }
  return (
    <MeClient
      weekLaunchAt={week.launchAt}
      weekTheme={week.theme}
      weekNumber={week.weekNumber}
      challenges={weekChallenges}
    >
      <CountdownToFriday
        launchAt={week.launchAt}
        theme={week.theme}
        weekNumber={week.weekNumber}
      />
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-foreground">
            Your Week 1 path
          </h2>
          <Link
            href="/me/avatar"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Edit character →
          </Link>
        </div>
        <ChallengePath challenges={weekChallenges} hasLaunched={false} />
      </div>
    </MeClient>
  );
}
