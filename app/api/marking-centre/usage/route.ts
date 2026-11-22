import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { getUsage } from "@/lib/marking/usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

// Estimated AI spend this month for the signed-in teacher, used to show a cost
// estimate before marking a batch. Estimates only: the provider's bill is authoritative.
export async function GET(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    return NextResponse.json(await getUsage(actor.uid), { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
