import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getMemberByName,
  getMemberPasscodeHash,
  updateMemberPasscode,
} from "@/lib/airtable";
import { hashPasscode, verifyPasscode } from "@/lib/passcode";

const MIN_PASSCODE_LEN = 4;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { name?: string; passcode?: string };
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

  const member = await getMemberByName(name);
  if (!member) {
    return Response.json({ error: "No member with that name" }, { status: 404 });
  }

  const stored = await getMemberPasscodeHash(member.id);

  if (!stored) {
    const newHash = hashPasscode(passcode);
    await updateMemberPasscode(member.id, newHash);
    revalidatePath("/");
    return Response.json({ memberId: member.id, claimed: true });
  }

  if (!verifyPasscode(passcode, stored)) {
    return Response.json({ error: "Wrong passcode" }, { status: 401 });
  }

  return Response.json({ memberId: member.id, claimed: false });
}
