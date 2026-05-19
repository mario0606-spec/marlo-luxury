import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/error?error=MissingToken", request.url)
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.expires < new Date() || record.type !== "EMAIL_VERIFICATION") {
    return NextResponse.redirect(
      new URL("/auth/error?error=InvalidToken", request.url)
    );
  }

  await prisma.user.update({
    where: { id: record.userId! },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.redirect(
    new URL("/auth/signin?verified=true", request.url)
  );
}
