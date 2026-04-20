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
      "Accept the default empty workspace — you'll seed the real structure in the next challenge with Claude.",
      "Tick the box below to confirm you're in.",
    ],
    askClaudePrompt:
      "I just signed up for Notion for the first time. I'm in fundraising at a football charity. In 3 bullets, what's the one mental model I should hold about Notion so I don't over-organise it in the first week?",
    tipline:
      "Don't build the filing cabinet by hand — the next challenge has Claude do it for you in one prompt.",
  },
  "Connect Claude to Granola and Notion": {
    howTo: [
      "Open claude.ai and go to Settings → Connectors (or the Connect menu in a new chat).",
      "Enable the Granola connector — sign in with the same account you used for Granola.",
      "Enable the Notion connector — approve access to your workspace when prompted.",
      "Run a sanity prompt: ask Claude 'What was my last Granola meeting about?' — confirm you get real content back.",
      "Tick the box below once both are working.",
    ],
    askClaudePrompt:
      "I just connected you to Granola and Notion. First, confirm you can see both by listing my 3 most recent Granola meetings and naming one top-level page in my Notion. Then in 2 bullets, tell me the one habit I should build this week that takes advantage of both being connected.",
    tipline:
      "This is the unlock step. Once connectors are live, every later challenge is a one-sentence prompt away.",
  },
  "Seed your Notion structure with Claude": {
    howTo: [
      "Make sure the previous challenge is done — Claude needs the Notion connector live.",
      "Open a new Claude chat and paste the prompt on the right (edit the bracketed bits for your name and working style).",
      "Claude will create a 'FR — [Your Name]' landing page with sub-pages. Watch it work; it only takes a few seconds.",
      "Hop into Notion and check the result. Rename or add pages if anything feels off — you own this corner.",
      "Paste the URL of your new landing page below.",
    ],
    askClaudePrompt:
      "Using the Notion connector, create a new top-level page in my workspace called 'FR — [Your Name]'. Under it, add these sub-pages: Meeting Notes, Donors, Prompts, Scratchpad. For Meeting Notes and Donors, make them databases with sensible properties (date, who, summary for meetings; name, stage, last-touch for donors). Keep it minimal — I'd rather add later than delete. Confirm when done and give me the link.",
    tipline:
      "Tommy owns the shared folders. This one is yours — Claude just saved you an hour of clicking.",
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
