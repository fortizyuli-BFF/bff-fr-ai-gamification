"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AvatarPicker } from "./AvatarPicker";
import { getSessionMemberId, markOnboarded } from "@/lib/session";
import type { Member } from "@/lib/airtable";

export function AvatarEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const isFirstRun = params.get("first") === "1";
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const id = getSessionMemberId();
    if (!id) {
      router.replace("/");
      return;
    }
    fetch(`/api/members/${id}`)
      .then((r) => r.json())
      .then(({ member }: { member: Member }) => setMember(member))
      .catch(() => router.replace("/"));
  }, [router]);

  if (!member) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">
          {isFirstRun ? "One more thing" : "Your character"}
        </p>
        <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          {isFirstRun
            ? `Welcome, ${member.name}. Build your character.`
            : `Touch up the look, ${member.name}.`}
        </h1>
        <p className="mt-3 text-sm text-foreground/70 sm:text-base">
          Your character shows up next to your completions on the team feed.
          Take 30 seconds — it&apos;s the only vanity we&apos;re indulging.
        </p>
      </div>

      <AvatarPicker
        memberId={member.id}
        initial={member.avatar}
        submitLabel={isFirstRun ? "That's me — continue" : "Save character"}
        onSaved={() => {
          markOnboarded();
          router.push("/me");
        }}
      />
    </div>
  );
}
