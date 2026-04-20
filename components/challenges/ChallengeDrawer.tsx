"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ExternalLink, Loader2, X } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import type { Challenge } from "@/lib/airtable";
import { helpFor } from "@/lib/weekContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  challenge: Challenge | null;
  hasLaunched: boolean;
  completed: boolean;
  onClose: () => void;
  onComplete: (
    challengeId: string,
    proof: { proofText?: string; proofUrl?: string }
  ) => Promise<void>;
};

export function ChallengeDrawer({
  challenge,
  hasLaunched,
  completed,
  onClose,
  onComplete,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [proof, setProof] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setProof("");
    setSubmitting(false);
  }, [challenge?.id]);

  if (!challenge) return null;

  const help = helpFor(challenge);
  const askUrl = help
    ? `https://claude.ai/new?q=${encodeURIComponent(help.askClaudePrompt)}`
    : "https://claude.ai";

  const needsProof =
    challenge.proofType === "URL" || challenge.proofType === "Text";
  const canSubmit = hasLaunched && !completed && !submitting &&
    (!needsProof || proof.trim().length > 0);

  const copyPrompt = async () => {
    if (!help) return;
    try {
      await navigator.clipboard.writeText(help.askClaudePrompt);
      setCopied(true);
      toast.success("Prompt copied — paste it into Claude");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — try again");
    }
  };

  const fireConfetti = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const gold = ["#CB9D6B", "#F0C69A", "#ffffff"];
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.7 },
      colors: gold,
      gravity: 0.9,
      ticks: 180,
    });
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const value = proof.trim();
    const proofPayload =
      challenge.proofType === "URL"
        ? { proofUrl: value }
        : challenge.proofType === "Text"
          ? { proofText: value }
          : {};
    try {
      await onComplete(challenge.id, proofPayload);
      fireConfetti();
      toast.success(
        challenge.feedbackOnComplete ||
          `+${challenge.points} pts — ${challenge.title} done`,
        { duration: 5000 }
      );
      setTimeout(() => onClose(), 1100);
    } catch (err) {
      setSubmitting(false);
      const msg =
        err instanceof Error ? err.message : "Couldn't save — try again";
      toast.error(msg);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.aside
        key="drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-hidden bg-background shadow-2xl sm:rounded-l-3xl"
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 border-b border-border px-6 pb-5 pt-6 sm:px-8"
          style={{ backgroundColor: "var(--bff-gold-wash)" }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display-caps text-[10px] text-primary">
                Tier · {challenge.tier}
              </span>
              <span className="text-border">·</span>
              <span className="font-display-caps text-[10px] text-muted-foreground">
                {challenge.points} pts
              </span>
              {!hasLaunched && (
                <>
                  <span className="text-border">·</span>
                  <span className="font-display-caps text-[10px] text-accent-foreground">
                    Previewing
                  </span>
                </>
              )}
              {completed && (
                <>
                  <span className="text-border">·</span>
                  <span className="font-display-caps text-[10px] text-primary">
                    ✓ Done
                  </span>
                </>
              )}
            </div>
            <h2 className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-3xl">
              {challenge.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {challenge.description && (
            <p className="text-[15px] leading-relaxed text-foreground/80">
              {challenge.description}
            </p>
          )}

          {help && (
            <>
              <section className="mt-8">
                <p className="font-display-caps text-[11px] text-muted-foreground">
                  How to · step by step
                </p>
                <ol className="mt-3 space-y-3">
                  {help.howTo.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-xl border border-border/60 bg-card p-3"
                    >
                      <span
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: "var(--bff-gold-wash)",
                          color: "var(--bff-black)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground/85">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 border-l-2 border-primary/40 pl-3 text-xs italic text-muted-foreground">
                  {help.tipline}
                </p>
              </section>

              <section
                className="mt-8 overflow-hidden rounded-2xl border border-primary/25"
                style={{ backgroundColor: "var(--bff-gold-wash)" }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-primary/15 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AskClaudeMark />
                    <p className="font-display-caps text-[11px] text-foreground">
                      Stuck? Ask Claude
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    One-click prompt
                  </span>
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm italic leading-relaxed text-foreground/85">
                    &ldquo;{help.askClaudePrompt}&rdquo;
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={askUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition hover:opacity-90"
                      style={{
                        backgroundColor: "var(--bff-black)",
                        color: "#fff",
                      }}
                    >
                      Open in Claude
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={copyPrompt}
                      className="flex-1"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          Copy prompt
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </section>
            </>
          )}

          {challenge.feedbackOnComplete && (
            <section className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-4">
              <p className="font-display-caps text-[10px] text-muted-foreground">
                When you finish
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {challenge.feedbackOnComplete}
              </p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-card px-6 py-4 sm:px-8">
          {!hasLaunched ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="text-muted-foreground">
                Unlocks Friday 16:00 London.
              </p>
              <Button variant="outline" onClick={onClose}>
                Got it
              </Button>
            </div>
          ) : completed ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="flex items-center gap-2 text-foreground/80">
                <Check className="h-4 w-4 text-primary" />
                You earned {challenge.points} pts on this one.
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {needsProof && (
                <div>
                  <label
                    htmlFor="proof"
                    className="mb-1 block font-display-caps text-[10px] text-muted-foreground"
                  >
                    {challenge.proofPrompt ||
                      (challenge.proofType === "URL"
                        ? "Paste the link"
                        : "Paste your proof")}
                  </label>
                  <Input
                    id="proof"
                    type={challenge.proofType === "URL" ? "url" : "text"}
                    inputMode={
                      challenge.proofType === "URL" ? "url" : undefined
                    }
                    placeholder={
                      challenge.proofType === "URL"
                        ? "https://…"
                        : "Paste your proof here"
                    }
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              )}
              <Button
                type="button"
                className="w-full"
                disabled={!canSubmit}
                onClick={submit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>Mark as done · +{challenge.points} pts</>
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function AskClaudeMark() {
  return (
    <div
      className="flex h-5 w-5 items-center justify-center rounded"
      style={{ backgroundColor: "var(--bff-black)" }}
    >
      <span
        className="font-display text-[10px]"
        style={{ color: "var(--bff-gold)" }}
      >
        C
      </span>
    </div>
  );
}
