import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createMember, getMemberByName } from "@/lib/airtable";
import { hashPasscode } from "@/lib/passcode";

const MIN_PASSCODE_LEN = 4;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string;
    passcode?: string;
    role?: string;
  };
  const name = body.name?.trim();
  const passcode = body.passcode ?? "";

  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  if (passcode.length < MIN_PASSCODE_LEN) {
    return Response.json(
      { error: `Passcode must be at least ${MIN_PASSCODE_LEN} characters` },
      { status: 400 }
    );
  }

  const existing = await getMemberByName(name);
  if (existing) {
    return Response.json(
      { error: "That name is taken — try logging in instead" },
      { status: 409 }
    );
  }

  const member = await createMember({
    name,
    role: body.role,
    passcodeHash: hashPasscode(passcode),
  });

  revalidatePath("/");
  revalidatePath("/me");
  return Response.json({ memberId: member.id }, { status: 201 });
}
