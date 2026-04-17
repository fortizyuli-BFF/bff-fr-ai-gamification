"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarPlaceholder } from "@/components/avatar/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSessionMemberId,
  setSessionMemberId,
  hasOnboarded,
} from "@/lib/session";
import type { Member } from "@/lib/airtable";
import { cn } from "@/lib/utils";

type Props = {
  members: Member[];
};

export function MemberPicker({ members }: Props) {
  const router = useRouter();
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [returningMemberId, setReturningMemberId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const id = getSessionMemberId();
    if (id && hasOnboarded()) setReturningMemberId(id);
  }, []);

  const returning = returningMemberId
    ? members.find((m) => m.id === returningMemberId)
    : null;

  const pick = (m: Member) => {
    setSessionMemberId(m.id);
    const needsAvatar = !m.avatar.head;
    router.push(needsAvatar ? "/me/avatar?first=1" : "/me");
  };

  const addYourself = () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Type your name first");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        toast.error("Couldn't add you — try again");
        return;
      }
      const data = (await res.json()) as { member: Member };
      setSessionMemberId(data.member.id);
      router.push("/me/avatar?first=1");
    });
  };

  return (
    <div>
      {returning && (
        <div className="mb-10 rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <p className="text-xs uppercase tracking-widest text-primary">
            Welcome back
          </p>
          <div className="mt-3 flex items-center gap-4">
            <Avatar
              head={returning.avatar.head}
              shirt={returning.avatar.shirt}
              pants={returning.avatar.pants}
              shoes={returning.avatar.shoes}
              primaryColor={returning.avatar.primaryColor}
              size={64}
            />
            <div className="flex-1">
              <p className="text-lg font-semibold">{returning.name}</p>
              <p className="text-sm text-muted-foreground">
                Pick up where you left off.
              </p>
            </div>
            <Button onClick={() => pick(returning)}>Continue</Button>
          </div>
        </div>
      )}

      <h2 className="mb-4 font-display text-2xl text-foreground">
        Who are you?
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Tap your name to get started. It&apos;s your team — no passwords.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {members.map((m) => {
          const hasAvatar = Boolean(m.avatar.head);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => pick(m)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition",
                "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
              )}
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-end justify-center overflow-hidden rounded-xl bg-muted/60">
                {hasAvatar ? (
                  <Avatar
                    head={m.avatar.head}
                    shirt={m.avatar.shirt}
                    pants={m.avatar.pants}
                    shoes={m.avatar.shoes}
                    primaryColor={m.avatar.primaryColor}
                    size={58}
                    idle={false}
                  />
                ) : (
                  <AvatarPlaceholder size={58} className="text-foreground/30" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {m.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hasAvatar ? "Continue" : "Start here"}
                </p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setAddingNew((v) => !v)}
          className={cn(
            "group flex items-center justify-center rounded-2xl border border-dashed border-border bg-transparent p-4 text-left transition",
            "hover:border-foreground/40 hover:bg-muted/40"
          )}
        >
          <span className="text-sm text-muted-foreground">
            + Add yourself
          </span>
        </button>
      </div>

      {addingNew && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <Label htmlFor="new-name" className="text-sm">
            Your first name
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="new-name"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Priya"
              onKeyDown={(e) => e.key === "Enter" && addYourself()}
            />
            <Button
              onClick={addYourself}
              disabled={isPending || !newName.trim()}
            >
              {isPending ? "Adding..." : "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
