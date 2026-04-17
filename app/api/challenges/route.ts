import { listChallenges } from "@/lib/airtable";

export async function GET() {
  const challenges = await listChallenges();
  return Response.json({ challenges });
}
