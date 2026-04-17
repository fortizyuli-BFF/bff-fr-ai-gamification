import type { Challenge } from "@/lib/airtable";

export type ChallengeHelp = {
  howTo: string[];
  askClaudePrompt: string;
  tipline: string;
};

const HELP_BY_TITLE: Record<string, ChallengeHelp> = {
  "Create a Claude account": {
    howTo: [
      "Go to claude.ai and click Sign up.",
      "Use your f.ortizyuli@bloomsburyfootball.com style BFF email so we can manage the team later.",
      "Choose a strong password and confirm via email.",
      "Say hello: type 'What should I know before using you for donor research?' and read the reply.",
      "Paste the URL of that conversation into the proof box below.",
    ],
    askClaudePrompt:
      "I'm on the BFF Fundraising team. I'm new to you. In 5 bullets, what are the 3 kinds of tasks I should try first, and 1 trap to avoid? Keep it specific to fundraising — donor research, meeting prep, proposal drafts.",
    tipline:
      "The point isn't the account — it's having Claude open in a tab so you actually use it this week.",
  },
  "Create a Granola account": {
    howTo: [
      "Download Granola from granola.ai (Mac only for now).",
      "Sign in with your BFF Google account.",
      "Allow calendar access — Granola reads upcoming meetings so it can record the right ones.",
      "Open a test note (Cmd+N) and talk for 30 seconds to confirm transcription works.",
      "Tick the box below to confirm you're in.",
    ],
    askClaudePrompt:
      "I just installed Granola (an AI meeting notes tool). In 3 bullets, what's the one habit I should build this week so I actually use it — not just have it installed? I'm in fundraising, 4-6 meetings a day.",
    tipline:
      "Granola is passive — it only helps if it's running. Turn on auto-record for calendar events.",
  },
  "Create a Notion account": {
    howTo: [
      "Go to notion.so and sign up with your BFF email.",
      "Choose 'For work' and skip the template picker.",
      "Create a page called 'FR — [Your Name]' — this is your personal landing page.",
      "Add three sub-pages: Meeting Notes · Donors · Prompts.",
      "Paste the URL of your landing page below.",
    ],
    askClaudePrompt:
      "I'm building a personal Notion workspace for fundraising at a football charity. I have 3 pages: Meeting Notes, Donors, Prompts. Suggest the exact property structure (database columns) for each so I don't have to think about it again. Keep it minimal — I'd rather add later than delete.",
    tipline:
      "Notion is just the filing cabinet. The goal is to know where Granola transcripts and donor briefs will live.",
  },
  "Record 5 meetings in Granola": {
    howTo: [
      "Turn on Granola's auto-record for any meeting in your calendar.",
      "Mix of internal and external is fine — team standups count.",
      "After each meeting, open the note and read the summary. Correct anything weird.",
      "Add a one-line 'what mattered' at the top in your own words.",
      "When you hit 5, paste one of the transcript links below as proof.",
    ],
    askClaudePrompt:
      "Here's a Granola transcript of a donor meeting: [PASTE]. Write me a 4-bullet follow-up: (1) what they committed to, (2) what I committed to, (3) their concerns we didn't resolve, (4) the single most important next move. Be specific, no fluff.",
    tipline:
      "Reps matter more than perfect notes. If a transcript is 70% right, that's enough to work from.",
  },
  "Upload 3 meeting notes to shared Notion 'FR Meetings'": {
    howTo: [
      "In Notion, open your 'Meeting Notes' database.",
      "For each of 3 meetings, create a row with: date · who · one-line summary · link to Granola transcript.",
      "Paste the full Granola summary into the page body. Don't over-edit — you're curating, not rewriting.",
      "Tag each with the donor/organisation if relevant.",
      "Paste the 3 Notion page URLs below as proof.",
    ],
    askClaudePrompt:
      "I've uploaded 3 meeting notes into Notion. Here are the one-line summaries: [PASTE 3 LINES]. Spot any patterns across them — recurring themes, donor signals, open questions I should follow up on. Be blunt; I want the thing I'm missing.",
    tipline:
      "This is the payoff step — once 3 notes are in Notion, Claude can reason across them next week.",
  },
};

export function helpFor(challenge: Challenge): ChallengeHelp | null {
  return HELP_BY_TITLE[challenge.title] ?? null;
}
