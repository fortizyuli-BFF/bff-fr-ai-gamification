import { listMembers } from "@/lib/airtable";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { MemberPicker } from "@/components/landing/MemberPicker";

export const revalidate = 30;

export default async function LandingPage() {
  const members = await listMembers();
  return (
    <>
      <BrandHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">
            Week 1 · &ldquo;Set the table&rdquo;
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            The FR team is going AI-native.
            <br />
            <span className="text-foreground/60">
              This is where we keep score.
            </span>
          </h1>
          <p className="mt-6 text-base text-foreground/70 sm:text-lg">
            Weekly challenges that turn meetings, donor research, and follow-ups
            into reps with Claude, Granola, and Notion. Friday drops. Real
            tools, not trivia.
          </p>
        </div>

        <MemberPicker members={members} />
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Built on{" "}
        <span className="font-medium">BEM</span> gamification · No points of
        shame, no streaks of guilt.
      </footer>
    </>
  );
}
