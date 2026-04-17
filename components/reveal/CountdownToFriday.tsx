"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCountdown, formatDropTime } from "@/lib/time";

type Props = {
  launchAt: string;
  theme: string;
  weekNumber: number;
  onLaunched?: () => void;
};

export function CountdownToFriday({
  launchAt,
  theme,
  weekNumber,
  onLaunched,
}: Props) {
  const [cd, setCd] = useState(() => getCountdown(launchAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getCountdown(launchAt);
      setCd(next);
      if (next.hasLaunched) {
        onLaunched?.();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [launchAt, onLaunched]);

  if (cd.hasLaunched) {
    return (
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-accent to-accent/30 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Week {weekNumber} is live
        </p>
        <h2 className="mt-2 font-display text-3xl text-foreground">
          &ldquo;{theme}&rdquo;
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          Your first challenges are unlocked below.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Week {weekNumber} drop
        </p>
        <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
          &ldquo;{theme}&rdquo;
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Unlocks {formatDropTime(launchAt)} London
        </p>

        <div className="mt-6 flex gap-2 sm:gap-3">
          <Cell label="days" value={cd.days} />
          <Separator />
          <Cell label="hours" value={cd.hours} />
          <Separator />
          <Cell label="min" value={cd.minutes} />
          <Separator />
          <Cell label="sec" value={cd.seconds} pulse />
        </div>

        <p className="mt-6 max-w-lg text-sm text-foreground/70">
          Five challenges drop at once. Some are quick wins, some need a real
          week. You&apos;ll tackle them in whatever order makes sense for you.
        </p>
      </div>

      {/* subtle radial glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-flame) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function Cell({
  label,
  value,
  pulse,
}: {
  label: string;
  value: number;
  pulse?: boolean;
}) {
  const display = value.toString().padStart(2, "0");
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl border border-border bg-background/60 p-3 sm:p-4">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={display}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="font-display text-3xl leading-none text-foreground sm:text-5xl"
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span
        className={`mt-1 text-[10px] uppercase tracking-widest sm:text-xs ${
          pulse ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="flex items-center text-lg text-muted-foreground sm:text-2xl">
      :
    </span>
  );
}
