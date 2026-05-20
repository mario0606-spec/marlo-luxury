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
    subject: "Verify your marianni account",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:28px;margin-bottom:8px;">marianni</h1>
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
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">marianni</h1>
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

interface DispatchConditionData {
  rentalId: string;
  itemName: string;
  brand: string;
  dispatchPhoto: string; // base64 data URL or external URL
}

export async function sendDispatchConditionEmail(email: string, data: DispatchConditionData) {
  const rentalUrl = `${APP_URL}/rentals/${data.rentalId}`;

  const photoHtml = data.dispatchPhoto.startsWith("data:")
    ? `<img src="${data.dispatchPhoto}" alt="Item condition" style="width:100%;max-width:560px;border:1px solid #e7e5e4;" />`
    : `<img src="${data.dispatchPhoto}" alt="Item condition" style="width:100%;max-width:560px;border:1px solid #e7e5e4;" />`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your ${data.brand} ${data.itemName} is on its way`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">marianni</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Your rental is on its way to you.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">
            ${data.brand} ${data.itemName}
          </h2>
          <p style="color:#57534e;font-size:14px;margin-bottom:16px;">
            Here is a photo of your item's condition at the time of dispatch.
            Please inspect the item upon arrival and contact us if anything looks different.
          </p>
          ${photoHtml}
        </div>

        <a href="${rentalUrl}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          View Rental
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          Reference: ${data.rentalId}
        </p>
      </div>
    `,
  });
}

interface DeliveryConfirmationData {
  rentalId: string;
  itemName: string;
  brand: string;
  endDate: string;
}

export async function sendDeliveryConfirmationEmail(email: string, data: DeliveryConfirmationData) {
  const rentalUrl = `${APP_URL}/dashboard/rentals`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Ihr ${data.brand} ${data.itemName} kommt heute an`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">marianni</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Ihr heutiges Paket ist auf dem Weg.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">
            ${data.brand} ${data.itemName} — Pflegehinweise
          </h2>
          <ul style="font-size:14px;color:#57534e;padding-left:20px;line-height:1.8;">
            <li>Bewahren Sie die Uhr in der mitgelieferten Box auf, wenn Sie sie nicht tragen.</li>
            <li>Vermeiden Sie Kontakt mit Wasser, Chemikalien oder starker Hitze.</li>
            <li>Reinigen Sie das Armband nur mit einem trockenen, weichen Tuch.</li>
            <li>Ziehen Sie die Uhr nicht direkt nach dem Sport an – Schweiß greift das Gehäuse an.</li>
            <li>Bei Fragen erreichen Sie uns jederzeit über den Live-Chat auf Ihrer Seite.</li>
          </ul>
        </div>

        <p style="font-size:14px;color:#57534e;margin-bottom:24px;">
          Rückgabedatum: <strong>${data.endDate}</strong>. Das vorausbezahlte Rücksendepaket liegt bereits im Paket.
        </p>

        <a href="${rentalUrl}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          Meine Miete ansehen
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          Referenz: ${data.rentalId}
        </p>
      </div>
    `,
  });
}

interface MidRentalCheckInData {
  rentalId: string;
  itemName: string;
  brand: string;
  endDate: string;
}

export async function sendMidRentalCheckInEmail(email: string, data: MidRentalCheckInData) {
  const catalogUrl = `${APP_URL}/catalog`;
  const rentalUrl = `${APP_URL}/dashboard/rentals`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Wie gefällt Ihnen die ${data.brand} ${data.itemName}?`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">marianni</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Wir hoffen, Sie genießen Ihre Miete.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:18px;font-weight:normal;margin-bottom:12px;">
            Wie behandelt Sie die ${data.brand} ${data.itemName}?
          </h2>
          <p style="font-size:14px;color:#57534e;line-height:1.7;">
            Wir freuen uns zu hören, wie es Ihnen geht. Wenn Sie Fragen haben oder Hilfe benötigen,
            ist unser Concierge-Team jederzeit für Sie da.
          </p>
        </div>

        <p style="font-size:14px;color:#57534e;margin-bottom:24px;">
          Rückgabedatum: <strong>${data.endDate}</strong>
        </p>

        <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
          <tr>
            <td style="padding-right:8px;">
              <a href="${rentalUrl}"
                 style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 20px;text-decoration:none;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                Miete verlängern
              </a>
            </td>
            <td>
              <a href="${catalogUrl}"
                 style="display:inline-block;border:1px solid #1a1a1a;color:#1a1a1a;padding:12px 20px;text-decoration:none;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                Nächste Miete buchen
              </a>
            </td>
          </tr>
        </table>

        <p style="color:#a8a29e;font-size:12px;margin-top:16px;">
          Referenz: ${data.rentalId}
        </p>
      </div>
    `,
  });
}

interface ReturnReminderData {
  rentalId: string;
  itemName: string;
  brand: string;
  endDate: string;
}

export async function sendReturnReminderEmail(email: string, data: ReturnReminderData) {
  const dashboardUrl = `${APP_URL}/dashboard/rentals`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Rückgabe in 2 Tagen — ${data.brand} ${data.itemName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">marianni</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Zeit, Abschied zu nehmen.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:18px;font-weight:normal;margin-bottom:12px;">
            ${data.brand} ${data.itemName} — Rückgabe am ${data.endDate}
          </h2>
          <p style="font-size:14px;color:#57534e;line-height:1.7;margin-bottom:20px;">
            Ihre Mietzeit endet übermorgen. So funktioniert die Rückgabe:
          </p>
          <ol style="font-size:14px;color:#57534e;padding-left:20px;line-height:2;">
            <li>Legen Sie die Uhr zurück in die mitgelieferte Box.</li>
            <li>Kleben Sie das vorfrankierte DHL-Rücksendeetikett auf das Paket.</li>
            <li>Geben Sie das Paket bis <strong>${data.endDate} 18:00 Uhr</strong> bei einer DHL-Filiale ab.</li>
          </ol>
          <p style="font-size:13px;color:#a8a29e;margin-top:16px;">
            Verspätete Rückgaben werden tagesgenau in Rechnung gestellt. Bei Schwierigkeiten melden Sie sich bitte sofort per Chat.
          </p>
        </div>

        <a href="${dashboardUrl}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          Meine Buchung ansehen
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          Referenz: ${data.rentalId}
        </p>
      </div>
    `,
  });
}

interface ReturnReceivedData {
  rentalId: string;
  itemName: string;
  brand: string;
  depositAmount: number;
}

export async function sendReturnReceivedEmail(email: string, data: ReturnReceivedData) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Wir haben Ihre ${data.brand} ${data.itemName} erhalten`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">marianni</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">Wir haben Ihre Rückgabe erhalten.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:18px;font-weight:normal;margin-bottom:12px;">
            ${data.brand} ${data.itemName} — sicher bei uns angekommen
          </h2>
          <p style="font-size:14px;color:#57534e;line-height:1.7;">
            Vielen Dank für die sorgfältige Rückgabe. Wir prüfen den Zustand des Artikels
            und erstatten die Kaution von <strong>${formatEur(data.depositAmount)}</strong> innerhalb
            von <strong>3–5 Werktagen</strong> auf Ihre ursprüngliche Zahlungsmethode zurück,
            sofern keine Schäden festgestellt werden.
          </p>
        </div>

        <p style="font-size:14px;color:#57534e;margin-bottom:24px;">
          Wir freuen uns, Sie bald wieder bei marianni begrüßen zu dürfen.
        </p>

        <a href="${APP_URL}/catalog"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          Neue Miete starten
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          Referenz: ${data.rentalId}
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
    subject: "Reset your marianni password",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:28px;margin-bottom:8px;">marianni</h1>
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

interface OnboardingConfirmationData {
  rentalId: string;
  itemName: string;
  brand: string;
  endDate: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export async function sendOnboardingConfirmationEmail(email: string, data: OnboardingConfirmationData) {
  const confirmationUrl = `${APP_URL}/onboarding/confirmation/${data.rentalId}`;
  const addr = data.shippingAddress;
  const addrLines = [addr.addressLine1, addr.addressLine2, `${addr.postalCode} ${addr.city}`, addr.country]
    .filter(Boolean)
    .join(", ");

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Ihre erste Uhr ist auf dem Weg — ${data.brand} ${data.itemName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;letter-spacing:2px;">marianni</h1>
        <p style="color:#a8a29e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:40px;">Luxury Watch Rentals</p>

        <h2 style="color:#1a1a1a;font-size:20px;font-weight:normal;margin-bottom:8px;">Ihre erste Uhr ist auf dem Weg.</h2>
        <p style="color:#57534e;font-size:14px;margin-bottom:32px;">
          Wir haben Ihre Auswahl erhalten und bereiten Ihre erste Uhr für den Versand vor.
          Sobald das Paket unterwegs ist, erhalten Sie Ihre Tracking-Nummer.
        </p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h3 style="color:#1a1a1a;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">Ihre Auswahl</h3>
          <p style="color:#1a1a1a;font-size:16px;margin-bottom:4px;">${data.brand}</p>
          <p style="color:#57534e;font-size:14px;margin-bottom:16px;">${data.itemName}</p>
          <p style="color:#78716c;font-size:13px;">Rückgabe bis: ${data.endDate}</p>
          <p style="color:#78716c;font-size:13px;">Lieferung an: ${addrLines}</p>
        </div>

        <a href="${confirmationUrl}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
          Bestellung ansehen
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:40px;line-height:1.6;">
          Fragen? Antworten Sie einfach auf diese E-Mail oder schreiben Sie uns über den Live-Chat.<br>
          Wir sind für Sie da.
        </p>
      </div>
    `,
  });
}

interface ReviewRequestData {
  rentalId: string;
  itemName: string;
  brand: string;
  itemSlug: string;
}

export async function sendReviewRequestEmail(email: string, data: ReviewRequestData) {
  const reviewUrl = `${APP_URL}/reviews/submit?rentalId=${data.rentalId}`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `How was your ${data.brand} ${data.itemName}?`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">Marlo Luxury Rentals</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">We hope you enjoyed your rental.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:18px;font-weight:normal;margin-bottom:12px;">
            Share your experience with the ${data.brand} ${data.itemName}
          </h2>
          <p style="font-size:14px;color:#57534e;line-height:1.7;margin-bottom:24px;">
            Your review helps other members choose the perfect watch for their occasion.
            It only takes a minute and means a great deal to our community.
          </p>
          <a href="${reviewUrl}"
             style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
            Write a Review
          </a>
        </div>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          Reference: ${data.rentalId}
        </p>
      </div>
    `,
  });
}
