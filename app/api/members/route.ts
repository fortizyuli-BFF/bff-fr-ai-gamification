import { NextRequest } from "next/server";
import { listMembers, createMember } from "@/lib/airtable";
import { revalidatePath } from "next/cache";

export async function GET() {
  const members = await listMembers();
  return Response.json({ members });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { name?: string; role?: string };
  const name = body.name?.trim();
  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  const member = await createMember({ name, role: body.role });
  revalidatePath("/");
  revalidatePath("/me");
  return Response.json({ member }, { status: 201 });
}
