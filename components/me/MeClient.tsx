"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/avatar/Avatar";
import { BrandHeader } from "@/components/brand/BrandHeader";
import type { Challenge, Member } from "@/lib/airtable";
import {
  getSessionMemberId,
  markOnboarded,
  clearSession,
} from "@/lib/session";

type Props = {
  weekLaunchAt: string;
  weekTheme: string;
  weekNumber: number;
  challenges: Challenge[];
  children: React.ReactNode;
};

export function MeClient({ children }: Props) {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
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
        return r.json();
      })
      .then(({ member }: { member: Member }) => {
        setMember(member);
        if (!member.avatar.head) {
          router.replace("/me/avatar?first=1");
          return;
        }
        markOnboarded();
        setLoading(false);
      })
      .catch(() => {
        clearSession();
        router.replace("/");
      });
  }, [router]);

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
              {member.name}{member.isAdmin && ", admin"}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              FR AI pioneer · {member.role ?? "Team member"}
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-display text-3xl text-foreground">0</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              points · week 1
            </p>
          </div>
        </div>

        <div className="space-y-10">{children}</div>
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.push("/");
          }}
          className="hover:text-foreground"
        >
          Not you? Sign out
        </button>
      </footer>
    </>
  );
}
