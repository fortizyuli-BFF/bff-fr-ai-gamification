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

type Mode =
  | { kind: "idle" }
  | { kind: "login"; member: Member }
  | { kind: "register" };

export function MemberPicker({ members }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>({ kind: "idle" });
  const [newName, setNewName] = useState("");
  const [passcode, setPasscode] = useState("");
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

  const continueReturning = (m: Member) => {
    const needsAvatar = !m.avatar.head;
    router.push(needsAvatar ? "/me/avatar?first=1" : "/me");
  };

  const startLogin = (m: Member) => {
    setMode({ kind: "login", member: m });
    setPasscode("");
  };

  const startRegister = () => {
    setMode({ kind: "register" });
    setNewName("");
    setPasscode("");
  };

  const cancel = () => {
    setMode({ kind: "idle" });
    setPasscode("");
    setNewName("");
  };

  const submitLogin = (member: Member) => {
    if (passcode.length < 4) {
      toast.error("Passcode must be at least 4 characters");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: member.name, passcode }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        memberId?: string;
        claimed?: boolean;
        error?: string;
      };
      if (!res.ok || !data.memberId) {
        toast.error(data.error ?? "Couldn't sign you in");
        return;
      }
      if (data.claimed) {
        toast.success("Passcode set — remember it for next time");
      }
      setSessionMemberId(data.memberId);
      const needsAvatar = !member.avatar.head;
      router.push(needsAvatar ? "/me/avatar?first=1" : "/me");
    });
  };

  const submitRegister = () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Type your name first");
      return;
    }
    if (passcode.length < 4) {
      toast.error("Passcode must be at least 4 characters");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, passcode }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        memberId?: string;
        error?: string;
      };
      if (!res.ok || !data.memberId) {
        toast.error(data.error ?? "Couldn't create your account");
        return;
      }
      setSessionMemberId(data.memberId);
      router.push("/me/avatar?first=1");
    });
  };

  return (
    <div>
      {returning && mode.kind === "idle" && (
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
            <Button onClick={() => continueReturning(returning)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      <h2 className="mb-4 font-display text-2xl text-foreground">
        Who are you?
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Tap your name and enter your passcode. New here? Add yourself.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {members.map((m) => {
          const hasAvatar = Boolean(m.avatar.head);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => startLogin(m)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition",
                mode.kind === "login" && mode.member.id === m.id
                  ? "border-primary"
                  : "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
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
                  {m.hasPasscode ? "Enter passcode" : "Set passcode"}
                </p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={startRegister}
          className={cn(
            "group flex items-center justify-center rounded-2xl border border-dashed border-border bg-transparent p-4 text-left transition",
            mode.kind === "register"
              ? "border-primary"
              : "hover:border-foreground/40 hover:bg-muted/40"
          )}
        >
          <span className="text-sm text-muted-foreground">
            + Add yourself
          </span>
        </button>
      </div>

      {mode.kind === "login" && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-display text-lg">{mode.member.name}</p>
            <button
              type="button"
              onClick={cancel}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <Label htmlFor="login-passcode" className="text-sm">
            {mode.member.hasPasscode ? "Enter your passcode" : "Set a passcode"}
          </Label>
          <p className="mt-1 mb-2 text-xs text-muted-foreground">
            {mode.member.hasPasscode
              ? "The one you set last time. Min 4 characters."
              : "First time? Pick anything 4+ characters. You'll use it next time."}
          </p>
          <div className="flex gap-2">
            <Input
              id="login-passcode"
              type="password"
              autoFocus
              autoComplete={
                mode.member.hasPasscode ? "current-password" : "new-password"
              }
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••"
              onKeyDown={(e) =>
                e.key === "Enter" && submitLogin(mode.member)
              }
            />
            <Button
              onClick={() => submitLogin(mode.member)}
              disabled={isPending || passcode.length < 4}
            >
              {isPending ? "Checking…" : "Continue"}
            </Button>
          </div>
        </div>
      )}

      {mode.kind === "register" && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-display text-lg">New here?</p>
            <button
              type="button"
              onClick={cancel}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <Label htmlFor="new-name" className="text-sm">
            Your first name
          </Label>
          <Input
            id="new-name"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Priya"
            className="mt-1"
          />
          <Label htmlFor="new-passcode" className="mt-4 block text-sm">
            Choose a passcode
          </Label>
          <p className="mt-1 mb-2 text-xs text-muted-foreground">
            Anything 4+ characters. Don&apos;t reuse a real password.
          </p>
          <div className="flex gap-2">
            <Input
              id="new-passcode"
              type="password"
              autoComplete="new-password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••"
              onKeyDown={(e) => e.key === "Enter" && submitRegister()}
            />
            <Button
              onClick={submitRegister}
              disabled={
                isPending || !newName.trim() || passcode.length < 4
              }
            >
              {isPending ? "Creating…" : "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
