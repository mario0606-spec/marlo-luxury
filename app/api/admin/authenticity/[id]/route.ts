import { NextRequest, NextResponse } from "next/server";
import { getAuthenticityById } from "@/lib/authenticity";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const record = getAuthenticityById(params.id);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(record);
}
