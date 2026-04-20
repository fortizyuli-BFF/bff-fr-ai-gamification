"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearSession } from "@/lib/session";

export function BrandHeader({
  memberName,
  onPath = "/me",
}: {
  memberName?: string | null;
  onPath?: string;
}) {
  const router = useRouter();

  const signOut = () => {
    clearSession();
    router.push("/");
  };

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          href={memberName ? onPath : "/"}
          className="group flex min-w-0 items-center gap-2"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            FR
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-lg text-foreground">
              BFF · AI Skilling
            </span>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Fundraising team
            </span>
          </div>
        </Link>
        {memberName && (
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-right text-sm leading-tight sm:block">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Signed in
              </p>
              <p className="font-medium text-foreground">{memberName}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
