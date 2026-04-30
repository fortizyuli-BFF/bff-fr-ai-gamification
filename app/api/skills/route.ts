import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  type SkillProfile,
  updateMemberSkillProfile,
} from "@/lib/airtable";

const MAX_NAME_LEN = 80;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    memberId?: string;
    count?: number;
    skills?: { name?: unknown; score?: unknown }[];
  };

  if (!body.memberId) {
    return Response.json({ error: "memberId required" }, { status: 400 });
  }

  if (body.count !== 5 && body.count !== 6) {
    return Response.json(
      { error: "count must be 5 or 6" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.skills) || body.skills.length !== body.count) {
    return Response.json(
      { error: `skills must be an array of ${body.count} entries` },
      { status: 400 }
    );
  }

  const skills: SkillProfile["skills"] = [];
  for (const raw of body.skills) {
    const name = String(raw?.name ?? "").trim();
    const score = Math.round(Number(raw?.score));
    if (!name) {
      return Response.json(
        { error: "Every skill needs a name" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(score) || score < 1 || score > 10) {
      return Response.json(
        { error: "Each score must be between 1 and 10" },
        { status: 400 }
      );
    }
    skills.push({ name: name.slice(0, MAX_NAME_LEN), score });
  }

  const profile: SkillProfile = {
    count: body.count,
    skills,
    updatedAt: new Date().toISOString(),
  };

  try {
    const member = await updateMemberSkillProfile(body.memberId, profile);
    revalidatePath("/me");
    return Response.json({ member });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
