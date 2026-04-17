import Link from "next/link";

export function BrandHeader({
  memberName,
  onPath = "/me",
}: {
  memberName?: string | null;
  onPath?: string;
}) {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href={memberName ? onPath : "/"}
          className="group flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            FR
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg text-foreground">
              BFF · AI Skilling
            </span>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Fundraising team
            </span>
          </div>
        </Link>
        {memberName && (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              Signed in as
            </span>
            <span className="font-medium">{memberName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
