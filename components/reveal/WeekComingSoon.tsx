import { Lock } from "lucide-react";

export function WeekComingSoon({ weekNumber }: { weekNumber: number }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--bff-gold-wash)" }}
        >
          <Lock className="h-4 w-4" style={{ color: "var(--bff-gold)" }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display-caps text-[11px] text-muted-foreground">
            Week {weekNumber} · coming Friday
          </p>
          <h3 className="mt-1 font-display text-xl text-foreground">
            Still shaping this one.
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/70">
            {`Week 1 shapes Week ${weekNumber}. The sharper the captures and the notes this week, the more the next drop can do. You'll see it here when it's live.`}
          </p>
        </div>
      </div>
    </div>
  );
}
