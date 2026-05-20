// Founding member constants and helpers
export const FOUNDING_MEMBER_LIMIT = 50;
// Launch: 2026-05-27, window = 4 weeks → closes 2026-06-24 23:59 CEST
export const FOUNDING_WINDOW_END = new Date("2026-06-24T21:59:00.000Z"); // 23:59 CEST = 21:59 UTC

export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
