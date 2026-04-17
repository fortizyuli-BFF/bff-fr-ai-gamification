"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Challenge } from "@/lib/airtable";

type Props = {
  open: boolean;
  weekNumber: number;
  theme: string;
  challenges: Challenge[];
  onDismiss: () => void;
};

const GOLD = "#CB9D6B";
const GOLD_SOFT = "#F0C69A";
const BLACK = "#2E2D2C";

export function WeekUnlockCeremony({
  open,
  weekNumber,
  theme,
  challenges,
  onDismiss,
}: Props) {
  const fired = useRef(false);
  const [phase, setPhase] = useState<"curtain" | "reveal" | "cards" | "ready">(
    "curtain"
  );

  useEffect(() => {
    if (!open) {
      fired.current = false;
      setPhase("curtain");
      return;
    }
    if (fired.current) return;
    fired.current = true;
    setPhase("curtain");

    const t1 = setTimeout(() => setPhase("reveal"), 600);
    const t2 = setTimeout(() => {
      setPhase("cards");
      // Gold confetti burst
      const end = Date.now() + 900;
      const colors = [GOLD, GOLD_SOFT, "#ffffff"];
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors,
          gravity: 0.9,
          ticks: 220,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors,
          gravity: 0.9,
          ticks: 220,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }, 1600);
    const t3 = setTimeout(() => setPhase("ready"), 1600 + 200 + challenges.length * 220);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [open, challenges.length]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ceremony"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ backgroundColor: BLACK }}
      >
        {/* Gold sweep band */}
        <motion.div
          className="absolute left-0 right-0 top-1/2 h-36 -translate-y-1/2"
          initial={{ x: "-120%", opacity: 0 }}
          animate={{
            x: phase === "curtain" ? "-120%" : "0%",
            opacity: phase === "curtain" ? 0 : 0.18,
          }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${GOLD} 35%, ${GOLD_SOFT} 50%, ${GOLD} 65%, transparent 100%)`,
          }}
        />

        {/* Radial glow */}
        <motion.div
          className="absolute h-[140vmin] w-[140vmin] rounded-full"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: phase === "cards" || phase === "ready" ? 0.25 : 0,
            scale: phase === "cards" || phase === "ready" ? 1 : 0.6,
          }}
          transition={{ duration: 1.4 }}
          style={{
            background: `radial-gradient(circle, ${GOLD} 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">
          <AnimatePresence mode="wait">
            {phase === "curtain" && (
              <motion.p
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-display-caps text-xs text-white/60"
                style={{ letterSpacing: "0.3em" }}
              >
                Week {weekNumber} · Drop
              </motion.p>
            )}
            {(phase === "reveal" || phase === "cards" || phase === "ready") && (
              <motion.div
                key="unlocked-lockup"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex flex-col items-center"
              >
                <p
                  className="font-display-caps text-xs"
                  style={{ color: GOLD, letterSpacing: "0.35em" }}
                >
                  Week {weekNumber} unlocked
                </p>
                <h1
                  className="mt-4 font-display text-5xl leading-none text-white sm:text-7xl"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  &ldquo;{theme}&rdquo;
                </h1>
                <div
                  className="mt-6 h-[3px] w-24"
                  style={{ backgroundColor: GOLD }}
                />
                <p className="mt-6 max-w-md text-sm text-white/70">
                  Five challenges. Three to set you up, two to put the tools
                  into real work. Tap any card to see the how-to.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card rail */}
          <AnimatePresence>
            {(phase === "cards" || phase === "ready") && (
              <motion.div
                key="cards-rail"
                className="mt-10 grid w-full gap-3 sm:grid-cols-5"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
                  },
                }}
              >
                {challenges.map((c, i) => (
                  <motion.div
                    key={c.id}
                    variants={{
                      hidden: { opacity: 0, y: 40, rotateX: -25 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        },
                      },
                    }}
                    className="flex h-32 flex-col justify-between rounded-xl border p-3 text-left"
                    style={{
                      borderColor: "rgba(255,255,255,0.14)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                      boxShadow: `0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(203,157,107,0.12)`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-display text-xs"
                        style={{ color: GOLD, letterSpacing: "0.15em" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-widest text-white/40"
                      >
                        {c.tier}
                      </span>
                    </div>
                    <p className="mt-auto text-xs font-medium leading-snug text-white/90">
                      {c.title}
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: GOLD_SOFT }}
                    >
                      {c.points} pts
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <AnimatePresence>
            {phase === "ready" && (
              <motion.button
                key="cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={onDismiss}
                className="mt-10 rounded-full px-8 py-3 font-display-caps text-xs transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: GOLD,
                  color: BLACK,
                  letterSpacing: "0.25em",
                }}
              >
                Enter the week
              </motion.button>
            )}
          </AnimatePresence>

          {/* Skip */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "ready" ? 0 : 0.5 }}
            onClick={onDismiss}
            className="absolute right-6 top-6 text-[11px] uppercase tracking-widest text-white/60 hover:text-white"
          >
            Skip
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
