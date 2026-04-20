"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const DRIVERS: { name: string; blurb: string }[] = [
  {
    name: "Identity",
    blurb:
      "You're an FR AI pioneer, not a seat filler. The avatar is yours; so is the arc.",
  },
  {
    name: "Discovery",
    blurb:
      "Friday 16:00 drops keep the rhythm. Anticipation is part of the game.",
  },
  {
    name: "Mastery",
    blurb:
      "Challenges force real tool use — no trivia. Setup → Apply → Integrate.",
  },
  {
    name: "Relatedness",
    blurb:
      "Your work feeds the team archive. Every completion helps everyone else.",
  },
  {
    name: "Empowerment",
    blurb: "Tackle challenges in any order. You own the pace inside the week.",
  },
  {
    name: "Efficiency",
    blurb:
      "Setup steps are short on purpose — they unlock everything downstream.",
  },
  {
    name: "Hedonism",
    blurb: "Confetti, avatars, playful copy. Light — not childish.",
  },
];

export function PointsPhilosophy() {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-primary/20"
      style={{ backgroundColor: "var(--bff-gold-wash)" }}
    >
      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <p className="font-display-caps text-[11px] text-primary">
          So — what are the points for?
        </p>
        <h3 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
          Points aren&apos;t a score to chase.
        </h3>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/80">
          <p>
            They&apos;re a <em>feedback signal</em> — a way of noticing what
            the team can now do that it couldn&apos;t last week.
          </p>
          <p>
            The real payoff isn&apos;t the number. It&apos;s the{" "}
            <strong className="text-foreground">capability</strong>: a Granola
            habit that captures meetings you&apos;d otherwise forget, a Notion
            corner the team can search, a Claude tab that turns those into
            briefs in minutes.
          </p>
          <p>
            Every completion changes what&apos;s possible for everyone else.
            That&apos;s the game. Points are just how we notice it happening.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-4 inline-flex items-center gap-1.5 font-display-caps text-[11px] text-primary hover:text-foreground"
        >
          <span>{open ? "Hide" : "The 7 drivers behind this"}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              key="drivers"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 grid gap-2 overflow-hidden sm:grid-cols-2"
            >
              {DRIVERS.map((d) => (
                <li
                  key={d.name}
                  className="rounded-lg border border-primary/15 bg-background/70 p-3"
                >
                  <p className="font-display-caps text-[10px] text-primary">
                    {d.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/75">
                    {d.blurb}
                  </p>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
