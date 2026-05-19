import { randomBytes } from "crypto";
import { prisma } from "./prisma";

export async function generateVerificationToken(
  email: string,
  userId: string
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.verificationToken.deleteMany({
    where: { identifier: email, type: "EMAIL_VERIFICATION" },
  });

  await prisma.verificationToken.create({
    data: {
      token,
      identifier: email,
      userId,
      expires,
      type: "EMAIL_VERIFICATION",
    },
  });

  return token;
}

export async function generatePasswordResetToken(
  email: string,
  userId: string
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.verificationToken.deleteMany({
    where: { identifier: email, type: "PASSWORD_RESET" },
  });

  await prisma.verificationToken.create({
    data: {
      token,
      identifier: email,
      userId,
      expires,
      type: "PASSWORD_RESET",
    },
  });

  return token;
}
