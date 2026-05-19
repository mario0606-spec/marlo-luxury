import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "noreply@marloluxury.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(cents / 100);
}

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

interface BookingConfirmationData {
  rentalId: string;
  itemName: string;
  brand: string;
  startDate: string;
  endDate: string;
  days: number;
  totalAmount: number;
  depositAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export async function sendBookingConfirmationEmail(email: string, data: BookingConfirmationData) {
  const confirmationUrl = `${APP_URL}/rentals/${data.rentalId}/confirmation`;
  const addr = data.shippingAddress;
  const addrLines = [addr.addressLine1, addr.addressLine2, `${addr.postalCode} ${addr.city}`, addr.country]
    .filter(Boolean)
    .join(", ");

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Booking confirmed — ${data.itemName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">Marlo Luxury Rentals</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Your booking is confirmed and pending payment.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">Booking Summary</h2>
          <table style="width:100%;font-size:14px;color:#57534e;border-collapse:collapse;">
            <tr><td style="padding:4px 0;">Item</td><td style="text-align:right;color:#1a1a1a;">${data.brand} ${data.itemName}</td></tr>
            <tr><td style="padding:4px 0;">Rental period</td><td style="text-align:right;">${data.startDate} — ${data.endDate} (${data.days} day${data.days !== 1 ? "s" : ""})</td></tr>
            <tr><td style="padding:4px 0;padding-top:12px;border-top:1px solid #f5f5f4;">Rental total</td><td style="text-align:right;padding-top:12px;border-top:1px solid #f5f5f4;color:#1a1a1a;">${formatEur(data.totalAmount - data.depositAmount)}</td></tr>
            <tr><td style="padding:4px 0;">Refundable deposit</td><td style="text-align:right;">${formatEur(data.depositAmount)}</td></tr>
            <tr><td style="padding:4px 0;font-weight:bold;color:#1a1a1a;">Total charged</td><td style="text-align:right;font-weight:bold;color:#1a1a1a;">${formatEur(data.totalAmount)}</td></tr>
          </table>
        </div>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:32px;">
          <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Delivery Address</h2>
          <p style="font-size:14px;color:#57534e;margin:0;">${data.shippingAddress.fullName}<br>${addrLines}</p>
        </div>

        <a href="${confirmationUrl}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          View Booking
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          Order reference: ${data.rentalId}<br>
          Payment is required to confirm your booking. Our team will be in touch.
        </p>
      </div>
    `,
  });
}

interface PurchaseOfferData {
  rentalId: string;
  itemId: string;
  itemName: string;
  brand: string;
  purchasePrice: number;
  creditAmount: number;
  finalPrice: number;
  purchasable: boolean;
}

export async function sendPurchaseOfferEmail(email: string, data: PurchaseOfferData) {
  const purchaseUrl = `${APP_URL}/purchase/${data.itemId}?rentalId=${data.rentalId}`;
  const notifyUrl = `${APP_URL}/catalog/${data.itemId}`;

  const bodyHtml = data.purchasable
    ? `
      <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
        <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">Exclusive Offer</h2>
        <table style="width:100%;font-size:14px;color:#57534e;border-collapse:collapse;">
          <tr><td style="padding:4px 0;">Purchase price</td><td style="text-align:right;color:#1a1a1a;">${formatEur(data.purchasePrice)}</td></tr>
          <tr><td style="padding:4px 0;color:#16a34a;">Rental credit</td><td style="text-align:right;color:#16a34a;">− ${formatEur(data.creditAmount)}</td></tr>
          <tr style="border-top:1px solid #e7e5e4;">
            <td style="padding:8px 0 4px;font-weight:bold;color:#1a1a1a;">You pay</td>
            <td style="text-align:right;padding:8px 0 4px;font-weight:bold;color:#1a1a1a;">${formatEur(data.finalPrice)}</td>
          </tr>
        </table>
      </div>
      <a href="${purchaseUrl}"
         style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
        CLAIM THIS OFFER
      </a>
    `
    : `
      <p style="color:#57534e;font-size:14px;margin-bottom:24px;">
        This piece isn't available for purchase yet, but you can register your interest and we'll notify you the moment it becomes available.
      </p>
      <a href="${notifyUrl}"
         style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
        NOTIFY ME WHEN AVAILABLE
      </a>
    `;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Own the ${data.brand} ${data.itemName} — exclusive offer inside`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">Marlo Luxury Rentals</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">You know this piece well — you've worn it twice.</p>

        <h2 style="color:#1a1a1a;font-size:20px;font-weight:normal;margin-bottom:8px;">
          Make it yours.
        </h2>
        <p style="color:#57534e;font-size:14px;margin-bottom:24px;">
          You've rented the <strong>${data.brand} ${data.itemName}</strong> twice. As a loyal renter, we'd like to offer you the chance to own it — with your last rental fee applied as a credit toward the purchase price.
        </p>

        ${bodyHtml}

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          This offer is personal to you and valid for 30 days. Questions? Reply to this email.
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

interface DispatchEmailData {
  rentalId: string;
  itemName: string;
  brand: string;
  startDate: string;
  endDate: string;
  dispatchPhoto: string | null;
}

export async function sendDispatchEmail(email: string, data: DispatchEmailData) {
  const rentalUrl = `${APP_URL}/dashboard/rentals`;
  const photoHtml = data.dispatchPhoto
    ? `<div style="margin-bottom:24px;">
         <img src="${data.dispatchPhoto}" alt="Item condition at dispatch" style="max-width:100%;border:1px solid #e7e5e4;" />
       </div>`
    : "";

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your ${data.brand} ${data.itemName} is on its way`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">Marlo Luxury Rentals</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Your watch is on its way.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">Dispatch Confirmation</h2>
          <table style="width:100%;font-size:14px;color:#57534e;border-collapse:collapse;">
            <tr><td style="padding:4px 0;">Item</td><td style="text-align:right;color:#1a1a1a;">${data.brand} ${data.itemName}</td></tr>
            <tr><td style="padding:4px 0;">Rental period</td><td style="text-align:right;">${data.startDate} — ${data.endDate}</td></tr>
          </table>
        </div>

        <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Current Condition</h2>
        <p style="color:#666;font-size:13px;margin-bottom:16px;">
          The following photo documents the condition of your watch at the time of dispatch. 
          You can view all condition photos in your rental history.
        </p>
        ${photoHtml}

        <a href="${rentalUrl}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          View Rental History
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          Order reference: ${data.rentalId}
        </p>
      </div>
    `,
  });
}
