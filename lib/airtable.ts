import "server-only";

const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const API_KEY = process.env.AIRTABLE_API_KEY!;

if (!BASE_ID || !API_KEY) {
  console.warn(
    "[airtable] Missing AIRTABLE_BASE_ID or AIRTABLE_API_KEY. API calls will fail at runtime."
  );
}

export const TABLES = {
  members: "tbln9HY3u76BNwG1C",
  challenges: "tblbHJsifbep6RGPH",
  completions: "tbltXzC9IV0Bk4GrB",
  weeks: "tblpwC7dAXcPClRwZ",
} as const;

export const FIELDS = {
  member: {
    name: "fldk2Q3X6d8e5ELfp",
    role: "fldr6ZlWImt62GPgk",
    isAdmin: "flddO1feAWYGumbXd",
    avatarHead: "fldV1qjCejSYXwJRS",
    avatarShirt: "fldoL43j04R55N3lY",
    avatarPants: "fldjziYOIzEq6IxZF",
    avatarShoes: "fldhev83VUxeC3Pss",
    avatarPrimaryColor: "fldWg0nGbjeQFNFGL",
  },
  challenge: {
    title: "fldy9hzQTKcViqN2W",
    weekNumber: "fldM2lbYEpDcFXsN0",
    tier: "fldvwu6K4gbtP8kfc",
    description: "fldieMyYjmiXEA4zW",
    requirements: "fldS8gguDlHpgkQtE",
    points: "fldQXXJ4JLLndCQhm",
    launchAt: "fldUzw3GH8SOO64Ry",
    proofType: "fldzM6rn5tmqMESic",
    proofPrompt: "fldFumXM4buWxhft0",
    feedbackOnComplete: "fld7ucItiuEGB76Jk",
    nextSuggestedAction: "fldalv9tMTyddrb1B",
  },
  completion: {
    label: "fldiDeYix81WIiDRT",
    member: "fldRYAAp1W9tdANWO",
    challenge: "fldnFSf3tJvpUNoRS",
    completedAt: "fldDABUR6AqTvvVUZ",
    proofText: "fld1ZDxdk2NTOIQM5",
    proofUrl: "fldVHVq1kXNiGGPDA",
    verifiedByAdmin: "fldfpwpE0B1joGriy",
    adminNotes: "fld20HNDELQ60Uip8",
    reactions: "fldWjSk21vVcJUYI1",
  },
  week: {
    weekNumber: "fldlEbxYxBjdeiegV",
    theme: "fldLev0RLE3FaRkuj",
    launchAt: "fldwM8QpS0gLeSluS",
    retroNotes: "fldHKdlcW9XoMK36E",
  },
} as const;

export type Member = {
  id: string;
  name: string;
  role: string | null;
  isAdmin: boolean;
  avatar: {
    head: string | null;
    shirt: string | null;
    pants: string | null;
    shoes: string | null;
    primaryColor: string | null;
  };
};

export type Challenge = {
  id: string;
  title: string;
  weekNumber: number;
  tier: "Setup" | "Apply" | "Integrate";
  description: string;
  requirements: string;
  points: number;
  launchAt: string;
  proofType: "Checkbox" | "URL" | "Text";
  proofPrompt: string;
  feedbackOnComplete: string;
  nextSuggestedAction: string;
};

export type Week = {
  id: string;
  weekNumber: number;
  theme: string;
  launchAt: string;
  retroNotes: string | null;
};

export type Completion = {
  id: string;
  memberId: string;
  challengeId: string;
  completedAt: string;
  proofText: string | null;
  proofUrl: string | null;
  verifiedByAdmin: boolean;
  adminNotes: string | null;
  reactions: Record<string, string>;
};

type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

async function airtableFetch(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<Response> {
  const { revalidate = 30, ...rest } = init ?? {};
  const sep = path.includes("?") ? "&" : "?";
  const url = `https://api.airtable.com/v0/${BASE_ID}/${path}${sep}returnFieldsByFieldId=true`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    next: { revalidate },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status} ${res.statusText}: ${body}`);
  }
  return res;
}

async function listAll(
  tableId: string,
  params: URLSearchParams = new URLSearchParams(),
  revalidate = 30
): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const q = new URLSearchParams(params);
    if (offset) q.set("offset", offset);
    const res = await airtableFetch(`${tableId}?${q.toString()}`, {
      revalidate,
    });
    const json = (await res.json()) as AirtableListResponse;
    out.push(...json.records);
    offset = json.offset;
  } while (offset);
  return out;
}

function toMember(r: AirtableRecord): Member {
  const f = r.fields;
  const get = (id: string) => f[id] as string | undefined;
  return {
    id: r.id,
    name: (get(FIELDS.member.name) ?? "").trim(),
    role: get(FIELDS.member.role) ?? null,
    isAdmin: Boolean(f[FIELDS.member.isAdmin]),
    avatar: {
      head: get(FIELDS.member.avatarHead) ?? null,
      shirt: get(FIELDS.member.avatarShirt) ?? null,
      pants: get(FIELDS.member.avatarPants) ?? null,
      shoes: get(FIELDS.member.avatarShoes) ?? null,
      primaryColor: get(FIELDS.member.avatarPrimaryColor) ?? null,
    },
  };
}

function toChallenge(r: AirtableRecord): Challenge {
  const f = r.fields;
  return {
    id: r.id,
    title: (f[FIELDS.challenge.title] as string) ?? "",
    weekNumber: (f[FIELDS.challenge.weekNumber] as number) ?? 0,
    tier: (f[FIELDS.challenge.tier] as Challenge["tier"]) ?? "Setup",
    description: (f[FIELDS.challenge.description] as string) ?? "",
    requirements: (f[FIELDS.challenge.requirements] as string) ?? "",
    points: (f[FIELDS.challenge.points] as number) ?? 0,
    launchAt: (f[FIELDS.challenge.launchAt] as string) ?? "",
    proofType:
      (f[FIELDS.challenge.proofType] as Challenge["proofType"]) ?? "Checkbox",
    proofPrompt: (f[FIELDS.challenge.proofPrompt] as string) ?? "",
    feedbackOnComplete:
      (f[FIELDS.challenge.feedbackOnComplete] as string) ?? "",
    nextSuggestedAction:
      (f[FIELDS.challenge.nextSuggestedAction] as string) ?? "",
  };
}

function toWeek(r: AirtableRecord): Week {
  const f = r.fields;
  return {
    id: r.id,
    weekNumber: (f[FIELDS.week.weekNumber] as number) ?? 0,
    theme: (f[FIELDS.week.theme] as string) ?? "",
    launchAt: (f[FIELDS.week.launchAt] as string) ?? "",
    retroNotes: (f[FIELDS.week.retroNotes] as string) ?? null,
  };
}

function extractLinkId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "id" in value) {
    const id = (value as { id: unknown }).id;
    return typeof id === "string" ? id : "";
  }
  return "";
}

function toCompletion(r: AirtableRecord): Completion {
  const f = r.fields;
  const memberLinks = (f[FIELDS.completion.member] as unknown[]) ?? [];
  const challengeLinks = (f[FIELDS.completion.challenge] as unknown[]) ?? [];
  let reactions: Record<string, string> = {};
  const raw = f[FIELDS.completion.reactions] as string | undefined;
  if (raw) {
    try {
      reactions = JSON.parse(raw);
    } catch {
      reactions = {};
    }
  }
  return {
    id: r.id,
    memberId: extractLinkId(memberLinks[0]),
    challengeId: extractLinkId(challengeLinks[0]),
    completedAt: (f[FIELDS.completion.completedAt] as string) ?? "",
    proofText: (f[FIELDS.completion.proofText] as string) ?? null,
    proofUrl: (f[FIELDS.completion.proofUrl] as string) ?? null,
    verifiedByAdmin: Boolean(f[FIELDS.completion.verifiedByAdmin]),
    adminNotes: (f[FIELDS.completion.adminNotes] as string) ?? null,
    reactions,
  };
}

export async function listMembers(): Promise<Member[]> {
  const records = await listAll(TABLES.members, new URLSearchParams(), 30);
  return records.map(toMember).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMember(id: string): Promise<Member | null> {
  try {
    const res = await airtableFetch(`${TABLES.members}/${id}`, {
      revalidate: 15,
    });
    const rec = (await res.json()) as AirtableRecord;
    return toMember(rec);
  } catch {
    return null;
  }
}

export async function createMember(input: {
  name: string;
  role?: string;
}): Promise<Member> {
  const res = await airtableFetch(TABLES.members, {
    method: "POST",
    revalidate: 0,
    body: JSON.stringify({
      returnFieldsByFieldId: true,
      fields: {
        [FIELDS.member.name]: input.name.trim(),
        ...(input.role ? { [FIELDS.member.role]: input.role } : {}),
      },
    }),
  });
  const rec = (await res.json()) as AirtableRecord;
  return toMember(rec);
}

export async function updateMemberAvatar(
  id: string,
  avatar: {
    head?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    primaryColor?: string;
  }
): Promise<Member> {
  const fields: Record<string, unknown> = {};
  if (avatar.head) fields[FIELDS.member.avatarHead] = avatar.head;
  if (avatar.shirt) fields[FIELDS.member.avatarShirt] = avatar.shirt;
  if (avatar.pants) fields[FIELDS.member.avatarPants] = avatar.pants;
  if (avatar.shoes) fields[FIELDS.member.avatarShoes] = avatar.shoes;
  if (avatar.primaryColor)
    fields[FIELDS.member.avatarPrimaryColor] = avatar.primaryColor;
  const res = await airtableFetch(`${TABLES.members}/${id}`, {
    method: "PATCH",
    revalidate: 0,
    body: JSON.stringify({ returnFieldsByFieldId: true, fields }),
  });
  const rec = (await res.json()) as AirtableRecord;
  return toMember(rec);
}

export async function listChallenges(): Promise<Challenge[]> {
  const params = new URLSearchParams();
  params.set("sort[0][field]", "weekNumber");
  params.set("sort[0][direction]", "asc");
  params.set("sort[1][field]", "tier");
  params.set("sort[1][direction]", "asc");
  const records = await listAll(TABLES.challenges, params, 60);
  return records.map(toChallenge);
}

export async function listWeeks(): Promise<Week[]> {
  const params = new URLSearchParams();
  params.set("sort[0][field]", "weekNumber");
  params.set("sort[0][direction]", "asc");
  const records = await listAll(TABLES.weeks, params, 60);
  return records.map(toWeek);
}

export async function listCompletions(): Promise<Completion[]> {
  const params = new URLSearchParams();
  params.set("sort[0][field]", "completedAt");
  params.set("sort[0][direction]", "desc");
  const records = await listAll(TABLES.completions, params, 15);
  return records.map(toCompletion);
}

export async function listCompletionsForMember(
  memberId: string
): Promise<Completion[]> {
  // Airtable formulas on linked-record fields return the primary DISPLAY
  // value (e.g. "Fran"), not the record ID — so we can't safely filterByFormula
  // by memberId. The dataset is small; fetch and filter in app.
  const all = await listCompletions();
  return all.filter((c) => c.memberId === memberId);
}

export async function createCompletion(input: {
  memberId: string;
  challengeId: string;
  proofText?: string;
  proofUrl?: string;
}): Promise<Completion> {
  const fields: Record<string, unknown> = {
    [FIELDS.completion.member]: [input.memberId],
    [FIELDS.completion.challenge]: [input.challengeId],
    [FIELDS.completion.completedAt]: new Date().toISOString(),
  };
  if (input.proofText) fields[FIELDS.completion.proofText] = input.proofText;
  if (input.proofUrl) fields[FIELDS.completion.proofUrl] = input.proofUrl;
  const res = await airtableFetch(TABLES.completions, {
    method: "POST",
    revalidate: 0,
    body: JSON.stringify({ returnFieldsByFieldId: true, fields }),
  });
  const rec = (await res.json()) as AirtableRecord;
  return toCompletion(rec);
}
