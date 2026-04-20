import { NextRequest } from "next/server";
import {
  getMember,
  listChallenges,
  listCompletionsForMember,
  updateMemberAvatar,
} from "@/lib/airtable";
import { pointsForWeek } from "@/lib/bem";
import { revalidatePath } from "next/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const [member, challenges, completions] = await Promise.all([
    getMember(id),
    listChallenges(),
    listCompletionsForMember(id),
  ]);
  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }
  const weekNumbers = Array.from(new Set(challenges.map((c) => c.weekNumber)));
  const points: Record<string, number> = {};
  for (const w of weekNumbers) {
    points[`week${w}`] = pointsForWeek(challenges, completions, id, w);
  }
  return Response.json({ member, completions, points });
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await request.json()) as {
    head?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    primaryColor?: string;
  };
  const member = await updateMemberAvatar(id, body);
  revalidatePath("/");
  revalidatePath("/me");
  revalidatePath("/me/avatar");
  return Response.json({ member });
}
