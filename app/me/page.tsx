import { listChallenges, listWeeks } from "@/lib/airtable";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { MeClient } from "@/components/me/MeClient";

export const dynamic = "force-dynamic";

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
  const hasNextWeekDefined = weeks.some((w) => w.weekNumber === 2);
  return (
    <MeClient
      weekLaunchAt={week.launchAt}
      weekTheme={week.theme}
      weekNumber={week.weekNumber}
      challenges={weekChallenges}
      hasNextWeekDefined={hasNextWeekDefined}
    />
  );
}
