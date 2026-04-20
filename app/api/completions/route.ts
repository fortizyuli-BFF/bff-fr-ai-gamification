import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createCompletion, listCompletionsForMember } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    memberId?: string;
    challengeId?: string;
    proofText?: string;
    proofUrl?: string;
  };

  if (!body.memberId || !body.challengeId) {
    return Response.json(
      { error: "memberId and challengeId required" },
      { status: 400 }
    );
  }

  try {
    const existing = await listCompletionsForMember(body.memberId);
    const already = existing.find((c) => c.challengeId === body.challengeId);
    if (already) {
      return Response.json({ completion: already });
    }
    const completion = await createCompletion({
      memberId: body.memberId,
      challengeId: body.challengeId,
      proofText: body.proofText,
      proofUrl: body.proofUrl,
    });
    revalidatePath("/me");
    revalidatePath("/team");
    return Response.json({ completion });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
