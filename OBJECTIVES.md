# BFF Fundraising Team — AI Skilling Gamification

> Level up the Fundraising team on AI tools (Claude, Granola, Notion) by making the learning itself the game.

---

## 1. Mission

Over the next months, the BFF Fundraising team becomes fluent in AI-assisted work — not through training decks, but through weekly, lived challenges that turn meetings, donor research, and follow-ups into reps with real tools. The side effect is a shared team knowledge layer that wouldn't exist without this habit.

## 2. Why now

- The team's work is meeting-heavy: donors, clients, internal projects.
- Granola captures what happened, Notion preserves what mattered, Claude reasons across both.
- Stitched together, these three form a compounding team asset. Used sporadically, they're nothing.
- A weekly challenge cadence turns sporadic use into habit.

## 3. Who it serves

- **Team members** (6–7): get skilled up on AI tools while doing their actual job. They see progress, peers' progress, and a growing sense of team capability.
- **Francisco (admin):** oversees adoption centrally — who's engaging, what's working, what the team can now do that it couldn't last week.

---

## 4. Why BEM Gamification

We're following **BEM (Behavioural-Experiential-Meaningful)** by **Javier & Ana María Velásquez** (Colombia). BEM is deliberately different from shallow "points + badges" gamification — it's built on intrinsic motivation, timely feedback, and systemic design.

### Three meta-principles that shape every choice

**a. Feedback ≠ Game status.** Points and badges are a snapshot of what someone holds. *Feedback* is an informational update about how the system has changed because of an action — and what new strategic moves are now possible. Our completion flow doesn't say "+10 pts." It says: "You're the 4th on the team to set up Granola. Next: try asking Claude to summarise your last transcript." Every completion surfaces a *new problem or capability*, not just a reward.

**b. Positional moves matter.** Not every challenge is a checkmate. Setting up accounts is a positional move — low visible payoff, high future optionality. The UI treats setup challenges as *enabling moves*, not filler.

**c. Emotional arc, not just positive emotions.** BEM designs a controlled range: anticipation (the locked Friday drop), curiosity (the reveal), resolve (doing the thing during the week), satisfaction (completion), pride (seeing your contribution on the team view). Not every screen needs to be "happy."

### The 7 drivers, and how they show up here

| Driver | How we express it |
|---|---|
| **Identity** (epic purpose) | Customisable avatar — head / shirt / pants / shoes + colour. Framing: "You are an FR AI pioneer." |
| **Discovery** (inner autonomy) | Friday 16:00 unlock, with a countdown + reveal animation |
| **Mastery** | Challenges force real tool use, not trivia. Progression: Setup → Apply → Integrate |
| **Relatedness** | Team feed, collective % complete, kudos reactions, shared weekly ritual |
| **Empowerment** (outer autonomy) | Multiple challenges per week — tackle in any order |
| **Efficiency** | Quick-win setup challenges, streak recognition |
| **Hedonism** | Confetti, avatar personalisation, playful copy — light, not childish |

---

## 5. UX philosophy

The craft comes from observing what works in the best consumer habit apps, and being honest about what to skip.

**We borrow:**
- **Duolingo** — lesson-path visualisation, celebration screens, streak flame, brand voice
- **BeReal** — the drop-moment ritual (ours is Friday 16:00)
- **Apple Fitness** — weekly ring, glanceable progress
- **Strava** — team activity feed, kudos reactions
- **Finch / Headspace** — warm palette, generous whitespace, non-aggressive tone
- **Linear / Things 3** — micro-interactions, empty states with personality

**We reject:**
- Leagues / ranked leaderboards as the primary surface — status over feedback, anti-BEM
- Heart / health depletion — BEM is non-punitive
- Streak-break shame — replaced with restorative "start a fresh chain"
- Aggressive notifications / nagging
- Variable-reward gambling loops (loot boxes, mystery rewards)
- Dual currency (gems + coins)

A sorted points table is available on `/team` as an opt-in tab, not the headline.

---

## 6. Challenge cadence

- **Weekly drops** every **Friday 16:00 Europe/London.**
- Each week has a **theme** and 2 tiers:
  - **Tier 1 — Setup / foundation:** quick wins, 10 pts each
  - **Tier 2 — Apply:** week-long commitments, 25 pts each
- **Tier 3 — Integrate** appears later (weeks 3+) as capabilities compound.
- **Weekly completion bonus:** +20 pts for finishing all of a week's challenges.
- **Streak bonus:** +15 pts per consecutive weekly completion.
- **No penalties, no decay, no failure states.** Points are feedback, not currency.

---

## 7. Week 1 — *"Set the table"*

**Launches:** Friday 2026-04-24 16:00 London
**Closes:** Friday 2026-05-01 16:00 London

### Tier 1 — Setup (10 pts each)

1. **Create a Claude account** — proof: URL to a saved chat, or screenshot uploaded to Notion with link.
2. **Create a Granola account** — proof: checkbox.
3. **Create a Notion account** — proof: URL to your personal landing page.

### Tier 2 — Apply (25 pts each)

4. **Record 5 meetings in Granola** (internal or external) — proof: count + one transcript link.
5. **Upload 3 meeting notes into a shared Notion "FR Meetings" database** — proof: 3 Notion URLs.

### Week 1 completion bonus

+20 pts for finishing all 5 = **total possible: 115 pts.**

---

## 8. Weeks 2–4 (sketch — not yet live)

The arc deliberately builds from capture → reasoning → workflow.

- **Week 2 — *"Ask the archive."*** Use Claude to summarise patterns across your 3 Notion uploads from Week 1. The team sees how captured meetings become a searchable knowledge layer.
- **Week 3 — *"Prompt as practice."*** Build a reusable donor-research prompt. Share it in team Notion. Team-level prompt library begins.
- **Week 4 — *"One workflow, end-to-end."*** Capture (Granola) → curate (Notion) → draft a donor follow-up email with Claude. The whole pipeline, one chain of reps.

---

## 9. Roles

### Team member

- Picks their name on first visit (no password; internal trust-based)
- Customises their avatar (head / shirt / pants / shoes + shirt colour)
- Sees this week's challenges on a path view, with locked/unlocked/completed states
- Self-reports completion with a proof URL or text
- Sees teammates' completions in the team feed; can kudos them
- Tracks their own weekly ring + streak flame

### Admin (Francisco)

- Accesses `/admin` with a passcode
- Sees every member's state — avatar, points, current tier, last activity
- Sees a weekly rollup: % of team that completed each challenge
- Can manually verify or revoke a completion
- Exports the completions log as CSV for internal reporting
- Frames the view as "what can the team now do that it couldn't last week?" — not a scoreboard

---

## 10. What success looks like

By end of Week 4 (2026-05-22):

- **All 6–7 team members** have Claude + Granola + Notion set up and have captured meetings at least once.
- **≥ 20 meeting notes** exist in the shared Notion FR Meetings database — a real, searchable archive.
- **≥ 5 reusable prompts** in the team prompt library.
- **≥ 3 team members** have completed a full capture → curate → Claude workflow at least once.
- **Weekly drops feel like a ritual**, not a chore. Engagement sustains without nagging.

Leading indicators we watch each week on `/admin`:

- % tier 1 completion (fast signal)
- % tier 2 completion (engagement signal)
- Median days-to-complete per challenge (friction signal)
- Kudos volume on team feed (relatedness signal)

---

## 11. Non-goals (V1)

- ❌ Automated verification through Granola / Notion APIs — self-report + admin spot-check for now. (V2.)
- ❌ Slack integration for Friday drops — possible V2 once the ritual is established.
- ❌ Native mobile app — responsive web only.
- ❌ Real-user auth with passwords — lightweight pick-your-name is enough.
- ❌ Unlockable avatar cosmetics tied to tiers — nice V2 idea.
- ❌ Multi-team / multi-tenancy — this is the FR team's thing.

---

## 12. Open strategic questions

1. **Leadership narrative.** Could this program become a story told upward — "the FR team is operating at the AI frontier" — that earns budget or visibility?
2. **Spread beyond FR.** If other BFF teams want it, do we spin up separate instances or build multi-team into the data model? (Not designed for it yet.)
3. **Physical rituals.** Does a tier-3 unlock deserve a physical token — a team dinner, a book? BEM doesn't require extrinsic rewards, but shared rituals compound relatedness.
4. **V2 API verification.** Once the honour-system phase has worked for a few weeks, should we wire Granola + Notion APIs so completions are verified automatically?
5. **Brand accent colour.** Default is warm orange `#E86A33` — confirm when you have BFF brand guidance.

---

*This document is a living charter. It evolves as the team does.*
