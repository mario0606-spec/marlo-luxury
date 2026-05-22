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

// ─── Dispatch & Purchase Offer Emails ──────────────────────────────────────

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
    ? `<img src="${data.dispatchPhoto}" alt="Dispatch condition" style="width:100%;max-width:560px;border:1px solid #e7e5e4;margin-top:16px;" />`
    : "";

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Ihr ${data.brand} ${data.itemName} ist unterwegs`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#FAF7F2;color:#1C1C1C;">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin-bottom:32px;">marianni</p>
        <h1 style="font-size:22px;font-weight:300;margin-bottom:8px;">Ihre Uhr ist auf dem Weg.</h1>
        <div style="border:1px solid #e7e5e4;padding:24px;margin:24px 0;">
          <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#78716c;margin-bottom:12px;">${data.brand} ${data.itemName}</p>
          <p style="font-size:14px;color:#57534e;margin:0;">Mietbeginn: ${data.startDate} — Rückgabe: ${data.endDate}</p>
          ${photoHtml}
        </div>
        <a href="${rentalUrl}" style="display:inline-block;background:#1C1C1C;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Meine Miete ansehen</a>
        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">Referenz: ${data.rentalId}</p>
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
  const itemUrl = `${APP_URL}/catalog`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Möchten Sie Ihren ${data.brand} ${data.itemName} kaufen?`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#FAF7F2;color:#1C1C1C;">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;margin-bottom:32px;">marianni</p>
        <h1 style="font-size:22px;font-weight:300;margin-bottom:8px;">Ein exklusives Angebot für Sie.</h1>
        <p style="font-size:14px;color:#57534e;margin-bottom:24px;">
          Sie haben die ${data.brand} ${data.itemName} bereits mehrfach gemietet. Als geschätztes Mitglied bieten wir Ihnen die Möglichkeit, diese Uhr zu erwerben.
        </p>
        ${data.purchasable ? `
        <div style="border:1px solid #C9A84C;padding:24px;margin:24px 0;">
          <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#78716c;margin-bottom:12px;">Ihr Angebot</p>
          <p style="font-size:14px;color:#57534e;margin:4px 0;">Kaufpreis: €${data.purchasePrice.toLocaleString("de-DE")}</p>
          <p style="font-size:14px;color:#57534e;margin:4px 0;">Mietguthaben: −€${data.creditAmount.toLocaleString("de-DE")}</p>
          <p style="font-size:18px;font-weight:300;color:#1C1C1C;margin-top:12px;">Ihr Preis: €${data.finalPrice.toLocaleString("de-DE")}</p>
        </div>
        <a href="${itemUrl}" style="display:inline-block;background:#1C1C1C;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Angebot ansehen</a>
        ` : `<p style="font-size:14px;color:#57534e;">Kontaktieren Sie uns, um mehr über einen Kauf zu erfahren.</p>`}
        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">Referenz: ${data.rentalId}</p>
      </div>
    `,
  });
}

// ─── Founding Member Emails ─────────────────────────────────────────────────

const MARIANNI_GOLD = "#C9A84C";
const MARIANNI_IVORY = "#FAF7F2";
const MARIANNI_CHARCOAL = "#1C1C1C";

function marianniEmailWrapper(body: string): string {
  return `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;padding:40px 24px;background:${MARIANNI_IVORY};color:${MARIANNI_CHARCOAL};">
      <div style="margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid rgba(201,168,76,0.3);">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${MARIANNI_GOLD};margin:0 0 4px;">marianni</p>
        <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(28,28,28,0.5);margin:0;">Trage den Moment.</p>
      </div>
      ${body}
      <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(28,28,28,0.15);font-size:11px;color:rgba(28,28,28,0.5);letter-spacing:1px;">
        <p style="margin:0;">marianni · Luxusuhren mieten, nicht kaufen.</p>
        <p style="margin:6px 0 0;">Du erhältst diese E-Mail, weil du auf unserer Warteliste stehst.</p>
      </div>
    </div>
  `;
}

export async function sendFoundingMemberTeaserEmail(email: string, firstName: string) {
  const landingUrl = `${APP_URL}/gruendungsmitglied`;

  await getResend().emails.send({
    from: process.env.EMAIL_FROM_MARIANNI ?? FROM,
    to: email,
    subject: `Wir sind fast bereit, ${firstName} —`,
    headers: { "X-Entity-Ref-ID": `founding-teaser-${email}` },
    html: marianniEmailWrapper(`
      <h1 style="font-size:26px;font-weight:normal;letter-spacing:1px;margin:0 0 16px;">Wir sind fast bereit, ${firstName}&nbsp;—</h1>
      <p style="font-size:14px;line-height:1.8;color:rgba(28,28,28,0.7);margin:0 0 16px;">Du stehst auf unserer Warteliste. Das bedeutet: Du warst früh genug dran, um zu merken, was hier entsteht.</p>
      <div style="background:${MARIANNI_CHARCOAL};padding:20px 24px;margin:24px 0;">
        <p style="font-size:17px;font-weight:normal;color:#fff;margin:0;">marianni geht nächste Woche live.</p>
      </div>
      <p style="font-size:14px;line-height:1.8;color:rgba(28,28,28,0.7);margin:0 0 8px;">Für die ersten 50 Menschen, die sich anmelden, haben wir etwas vorbereitet:</p>
      <p style="font-size:15px;line-height:1.8;color:${MARIANNI_CHARCOAL};margin:0 0 28px;"><strong>Erste 3 Monate zu 20&nbsp;% Rabatt.</strong> Plus eine persönliche Willkommenskarte.<br>Und deinen eigenen Referral-Link für <strong>€50 Guthaben</strong>.</p>
      <p style="font-size:14px;line-height:1.7;color:rgba(28,28,28,0.6);margin:0 0 32px;">Du bekommst als Erste/r Bescheid — noch bevor wir es öffentlich machen.</p>
      <a href="${landingUrl}" style="display:inline-block;background:${MARIANNI_GOLD};color:${MARIANNI_CHARCOAL};padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Gründungsplatz ansehen →</a>
      <p style="font-size:13px;color:rgba(28,28,28,0.5);margin:32px 0 0;font-style:italic;">Bis nächste Woche.<br>— Das marianni-Team</p>
    `),
  });
}

export async function sendFoundingMemberLaunchEmail(
  email: string,
  firstName: string,
  opts?: { slotsRemaining?: number }
) {
  const landingUrl = `${APP_URL}/gruendungsmitglied`;
  const slotsText = opts?.slotsRemaining != null ? String(opts.slotsRemaining) : "X";

  await getResend().emails.send({
    from: process.env.EMAIL_FROM_MARIANNI ?? FROM,
    to: email,
    subject: `Es ist soweit — die Gründungsphase ist offen, ${firstName}`,
    headers: { "X-Entity-Ref-ID": `founding-launch-${email}` },
    html: marianniEmailWrapper(`
      <h1 style="font-size:26px;font-weight:normal;letter-spacing:1px;margin:0 0 16px;">Es ist soweit, ${firstName}.</h1>
      <div style="background:${MARIANNI_CHARCOAL};padding:20px 24px;margin:0 0 24px;">
        <p style="font-size:16px;color:#fff;margin:0;">marianni ist live. Du hast 72 Stunden, um Gründungsmitglied zu werden.</p>
      </div>
      <p style="font-size:14px;margin:0 0 12px;color:rgba(28,28,28,0.7);">Was das bedeutet:</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr><td style="width:20px;color:${MARIANNI_GOLD};padding:4px 0;">✓</td><td style="font-size:14px;line-height:1.7;padding:4px 0;">Erste 3 Monate: <strong>20&nbsp;% günstiger</strong></td></tr>
        <tr><td style="color:${MARIANNI_GOLD};padding:4px 0;">✓</td><td style="font-size:14px;line-height:1.7;padding:4px 0;">Persönliche Willkommenskarte mit deiner ersten Uhr</td></tr>
        <tr><td style="color:${MARIANNI_GOLD};padding:4px 0;">✓</td><td style="font-size:14px;line-height:1.7;padding:4px 0;">Gründungsmitglied-Status — für immer</td></tr>
        <tr><td style="color:${MARIANNI_GOLD};padding:4px 0;">✓</td><td style="font-size:14px;line-height:1.7;padding:4px 0;"><strong>€50 Guthaben</strong> für jeden Freund, den du einlädst</td></tr>
      </table>
      <p style="font-size:13px;color:rgba(28,28,28,0.5);margin:0 0 28px;font-style:italic;">Nur 50 Plätze. Kein Nachrücken.</p>
      <a href="${landingUrl}" style="display:inline-block;background:${MARIANNI_GOLD};color:${MARIANNI_CHARCOAL};padding:16px 40px;text-decoration:none;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Jetzt Gründungsplatz sichern →</a>
      <p style="font-size:13px;color:rgba(28,28,28,0.5);margin:32px 0 0;font-style:italic;">Wir freuen uns, dich willkommen zu heißen.<br>— Das marianni-Team</p>
      <p style="font-size:12px;color:${MARIANNI_GOLD};margin:16px 0 0;">P.S. Noch ${slotsText} von 50 Plätzen verfügbar.</p>
    `),
  });
}

export async function sendFoundingMemberUrgencyEmail(
  email: string,
  firstName: string,
  opts?: { slotsRemaining?: number }
) {
  const landingUrl = `${APP_URL}/gruendungsmitglied`;
  const slotsText = opts?.slotsRemaining != null ? String(opts.slotsRemaining) : "X";

  await getResend().emails.send({
    from: process.env.EMAIL_FROM_MARIANNI ?? FROM,
    to: email,
    subject: `⏰ Noch 48 Stunden: Gründungspreis sichern, ${firstName}`,
    headers: { "X-Entity-Ref-ID": `founding-urgency-${email}` },
    html: marianniEmailWrapper(`
      <h1 style="font-size:26px;font-weight:normal;letter-spacing:1px;margin:0 0 16px;">Noch 48 Stunden, ${firstName}.</h1>
      <div style="background:${MARIANNI_CHARCOAL};padding:20px 24px;margin:0 0 24px;">
        <p style="font-size:16px;color:#fff;margin:0;">Das Gründungsangebot läuft in 48 Stunden ab.</p>
      </div>
      <p style="font-size:14px;line-height:1.7;color:rgba(28,28,28,0.7);margin:0 0 8px;">Am Samstag um 23:59 Uhr werden die letzten Gründungsplätze vergeben. Danach:</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 28px;">
        <tr><td style="width:20px;color:#cc3333;padding:3px 0;">✗</td><td style="font-size:14px;padding:3px 0;">kein 20&nbsp;%-Rabatt mehr</td></tr>
        <tr><td style="color:#cc3333;padding:3px 0;">✗</td><td style="font-size:14px;padding:3px 0;">kein Gründungsmitglied-Status</td></tr>
        <tr><td style="color:#cc3333;padding:3px 0;">✗</td><td style="font-size:14px;padding:3px 0;">keine Willkommenskarte</td></tr>
      </table>
      <p style="font-size:14px;line-height:1.7;margin:0 0 28px;">Wenn du dabei sein möchtest — jetzt ist der Moment.</p>
      <a href="${landingUrl}" style="display:inline-block;background:${MARIANNI_GOLD};color:${MARIANNI_CHARCOAL};padding:16px 40px;text-decoration:none;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Letzten Platz sichern →</a>
      <p style="font-size:13px;color:${MARIANNI_GOLD};margin:28px 0 0;">Noch ${slotsText} Plätze frei.</p>
      <p style="font-size:13px;color:rgba(28,28,28,0.5);margin:12px 0 0;font-style:italic;">— Das marianni-Team</p>
    `),
  });
}

export async function sendAvailabilityNotificationEmail(
  email: string,
  data: { itemId: string; itemName: string; brand: string; slug: string }
) {
  const bookUrl = `${APP_URL}/catalog/${data.slug}`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `${data.brand} ${data.itemName} is available again`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">Marlo Luxury Rentals</h1>
        <p style="color:#666;font-size:14px;margin-bottom:32px;">A piece you saved is back.</p>

        <div style="border:1px solid #e7e5e4;padding:24px;margin-bottom:24px;">
          <h2 style="color:#1a1a1a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">
            ${data.brand} ${data.itemName} is available again
          </h2>
          <p style="color:#57534e;font-size:14px;margin-bottom:20px;">
            Book it before someone else does.
          </p>
          <a href="${bookUrl}"
             style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
            Book Now
          </a>
        </div>

        <p style="color:#a8a29e;font-size:12px;margin-top:32px;">
          You're receiving this because you saved this item to your favorites on Marlo.
          <a href="${APP_URL}/dashboard/favorites" style="color:#a8a29e;">Manage favorites</a>
        </p>
      </div>
    `,
  });
}

interface FirstWatchConfirmationData {
  rentalId: string;
  userName: string;
  itemName: string;
  brand: string;
  estimatedDelivery: string;
  returnWindow: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export async function sendFirstWatchConfirmationEmail(
  email: string,
  data: FirstWatchConfirmationData
) {
  const dashboardUrl = `${APP_URL}/dashboard/rentals`;
  const addr = data.shippingAddress;
  const addressHtml = [addr.addressLine1, addr.addressLine2, `${addr.city} ${addr.postalCode}`, addr.country]
    .filter(Boolean)
    .join(", ");

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your ${data.brand} ${data.itemName} is confirmed`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff;">
        <p style="color:#a8a29e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Marlo Luxury Rentals</p>
        <h1 style="color:#1a1a1a;font-size:26px;font-weight:300;margin-bottom:4px;line-height:1.3;">
          Your first watch is on its way.
        </h1>
        <p style="color:#78716c;font-size:14px;margin-bottom:32px;">
          Welcome to Marlo, ${data.userName}. We are delighted to begin this with you.
        </p>

        <div style="border:1px solid #e7e5e4;padding:28px;margin-bottom:24px;">
          <p style="color:#a8a29e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">Your Selection</p>
          <p style="color:#1a1a1a;font-size:20px;font-weight:300;margin-bottom:4px;">${data.brand}</p>
          <p style="color:#1a1a1a;font-size:16px;margin-bottom:20px;">${data.itemName}</p>

          <table style="width:100%;font-size:13px;color:#78716c;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;border-top:1px solid #f5f5f4;">Estimated delivery</td>
              <td style="text-align:right;color:#1a1a1a;border-top:1px solid #f5f5f4;">${data.estimatedDelivery}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;border-top:1px solid #f5f5f4;">Return window</td>
              <td style="text-align:right;color:#1a1a1a;border-top:1px solid #f5f5f4;">${data.returnWindow}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;border-top:1px solid #f5f5f4;">Delivering to</td>
              <td style="text-align:right;color:#1a1a1a;border-top:1px solid #f5f5f4;">${addr.fullName}, ${addressHtml}</td>
            </tr>
          </table>
        </div>

        <p style="color:#57534e;font-size:14px;line-height:1.7;margin-bottom:28px;">
          Your watch will arrive in Marlo packaging with a care guide and prepaid return label.
          The return window closes on <strong>${data.returnWindow}</strong>.
        </p>

        <a href="${dashboardUrl}"
           style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
          View Rental Details
        </a>

        <p style="color:#a8a29e;font-size:12px;margin-top:40px;line-height:1.6;">
          Rental reference: ${data.rentalId}
        </p>
      </div>
    `,
  });
}
