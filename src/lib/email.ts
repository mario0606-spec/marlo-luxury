import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "noreply@marloluxury.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/api/verify-email?token=${token}`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Verify your Marlo account",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:28px;margin-bottom:8px;">Marlo Luxury Rentals</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Please verify your email address to activate your account.</p>
        <a href="${url}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:14px;letter-spacing:1px;">
          VERIFY EMAIL
        </a>
        <p style="color:#999;font-size:12px;margin-top:32px;">
          This link expires in 24 hours. If you didn't create an account, you can ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/auth/reset-password?token=${token}`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Reset your Marlo password",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:28px;margin-bottom:8px;">Marlo Luxury Rentals</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">You requested to reset your password.</p>
        <a href="${url}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:14px;letter-spacing:1px;">
          RESET PASSWORD
        </a>
        <p style="color:#999;font-size:12px;margin-top:32px;">
          This link expires in 1 hour. If you didn't request this, you can ignore this email.
        </p>
      </div>
    `,
  });
}
