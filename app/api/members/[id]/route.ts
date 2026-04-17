import { NextRequest } from "next/server";
import { getMember, updateMemberAvatar } from "@/lib/airtable";
import { revalidatePath } from "next/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const member = await getMember(id);
  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }
  return Response.json({ member });
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
