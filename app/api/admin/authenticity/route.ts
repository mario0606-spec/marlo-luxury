import { NextResponse } from "next/server";
import { getAllAuthenticityRecords } from "@/lib/authenticity";

export async function GET() {
  return NextResponse.json(getAllAuthenticityRecords());
}
