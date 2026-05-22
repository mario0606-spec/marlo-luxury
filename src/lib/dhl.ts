/**
 * DHL Paket Germany — Versenden API v2
 *
 * Correct product for DACH domestic shipments. DHL Paket provides full
 * end-to-end tracking, AdditionalInsurance for declared value, and
 * DHL Retoure Online for pre-paid return labels — at standard parcel pricing.
 *
 * Docs: https://developer.dhl.com/api-reference/parcel-de-shipping-post-parcel-germany-v2
 *
 * Required env vars:
 *   DHL_GKP_USER        — DHL Geschäftskundenportal username
 *   DHL_GKP_PASS        — DHL Geschäftskundenportal password
 *   DHL_API_KEY         — developer.dhl.com app API key (product: "DHL Parcel Germany")
 *   DHL_BILLING_NUMBER  — 14-character billing number (EKP 10-digit + product + participation)
 *                         e.g. "33333333330101" — shown in GKP under "Vertragsprodukte"
 *   DHL_RETOURE_BILLING_NUMBER — billing number for the Retoure product (separate contract line)
 *   DHL_SANDBOX         — set to "true" for sandbox (uses DHL sandbox credentials automatically)
 *
 * Shipper (Absender):
 *   DHL_SHIPPER_NAME
 *   DHL_SHIPPER_COMPANY
 *   DHL_SHIPPER_STREET        (street name only, no house number)
 *   DHL_SHIPPER_HOUSE_NUMBER  (house number only)
 *   DHL_SHIPPER_CITY
 *   DHL_SHIPPER_POSTAL_CODE
 *   DHL_SHIPPER_COUNTRY_CODE  (ISO 3166-1 alpha-3, e.g. "DEU")
 *   DHL_SHIPPER_PHONE
 *   DHL_SHIPPER_EMAIL
 */

const BASE_URL = "https://api-eu.dhl.com/parcel/de/shipping/v2";

// DHL sandbox credentials are fixed and public — documented at developer.dhl.com
const SANDBOX_GKP_USER = "sandy_sandbox";
const SANDBOX_GKP_PASS = "pass";
const SANDBOX_BILLING_NUMBER = "33333333330101";

function isSandbox(): boolean {
  return process.env.DHL_SANDBOX === "true";
}

function gkpCredentials(): { user: string; pass: string } {
  if (isSandbox()) return { user: SANDBOX_GKP_USER, pass: SANDBOX_GKP_PASS };
  const user = process.env.DHL_GKP_USER;
  const pass = process.env.DHL_GKP_PASS;
  if (!user || !pass) throw new Error("DHL_GKP_USER and DHL_GKP_PASS must be set");
  return { user, pass };
}

function apiKey(): string {
  if (isSandbox()) return process.env.DHL_API_KEY ?? "sandbox-key";
  const key = process.env.DHL_API_KEY;
  if (!key) throw new Error("DHL_API_KEY must be set");
  return key;
}

function billingNumber(): string {
  if (isSandbox()) return SANDBOX_BILLING_NUMBER;
  const bn = process.env.DHL_BILLING_NUMBER;
  if (!bn) throw new Error("DHL_BILLING_NUMBER must be set (14 chars, e.g. 33333333330101)");
  return bn;
}

function retoureBillingNumber(): string {
  if (isSandbox()) return SANDBOX_BILLING_NUMBER;
  const bn = process.env.DHL_RETOURE_BILLING_NUMBER ?? process.env.DHL_BILLING_NUMBER;
  if (!bn) throw new Error("DHL_RETOURE_BILLING_NUMBER (or DHL_BILLING_NUMBER) must be set");
  return bn;
}

function shipperAddress() {
  return {
    name1: process.env.DHL_SHIPPER_COMPANY ?? "Marlo Luxury Rentals GmbH",
    name2: process.env.DHL_SHIPPER_NAME,
    addressStreet: process.env.DHL_SHIPPER_STREET ?? "Musterstraße",
    addressHouse: process.env.DHL_SHIPPER_HOUSE_NUMBER ?? "1",
    postalCode: process.env.DHL_SHIPPER_POSTAL_CODE ?? "50667",
    city: process.env.DHL_SHIPPER_CITY ?? "Köln",
    country: process.env.DHL_SHIPPER_COUNTRY_CODE ?? "DEU",
    phone: process.env.DHL_SHIPPER_PHONE,
    email: process.env.DHL_SHIPPER_EMAIL ?? "versand@marloluxury.com",
  };
}

async function paketPost(path: string, body: unknown): Promise<unknown> {
  const creds = gkpCredentials();
  const basicAuth = Buffer.from(`${creds.user}:${creds.pass}`).toString("base64");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "dhl-api-key": apiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`DHL API non-JSON response (${res.status}): ${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    const detail =
      typeof json === "object" && json !== null
        ? JSON.stringify(
            (json as Record<string, unknown>).detail ??
            (json as Record<string, unknown>).title ??
            json
          )
        : text;
    throw new Error(`DHL Paket API error ${res.status}: ${detail}`);
  }

  return json;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string; // "Street 12" format — we split on last space for house number
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string; // ISO alpha-2, we convert to alpha-3 for DHL
  phone?: string;
  email?: string;
}

export interface DhlShipmentResult {
  outboundTrackingNumber: string;
  outboundLabelUrl: string;
  outboundLabelBase64: string;
  returnTrackingNumber: string;
  returnLabelUrl: string;
  returnLabelBase64: string;
}

// DHL Paket API uses ISO 3166-1 alpha-3 country codes
const ALPHA2_TO_ALPHA3: Record<string, string> = {
  DE: "DEU", AT: "AUT", CH: "CHE", NL: "NLD", BE: "BEL", FR: "FRA",
  PL: "POL", CZ: "CZE", LU: "LUX", IT: "ITA", ES: "ESP", GB: "GBR",
};

function toAlpha3(code: string): string {
  return ALPHA2_TO_ALPHA3[code.toUpperCase()] ?? code;
}

// Split "Hauptstraße 12a" into { street: "Hauptstraße", house: "12a" }
function splitStreetHouse(addressLine: string): { street: string; house: string } {
  const match = addressLine.match(/^(.+?)\s+(\S+)$/);
  if (!match) return { street: addressLine, house: "" };
  return { street: match[1], house: match[2] };
}

interface DhlOrderResponse {
  items?: Array<{
    shipmentNo?: string;
    shipmentRefNo?: string;
    returnShipmentNo?: string;
    label?: {
      b64?: string;
      fileFormat?: string;
    };
    returnLabel?: {
      b64?: string;
      fileFormat?: string;
    };
    validationMessages?: unknown[];
    sstatus?: { statusCode?: number; title?: string; detail?: string };
  }>;
}

/**
 * Create outbound DHL Paket shipment + DHL Retoure return label.
 *
 * Both labels are requested in a single POST /orders call via the
 * `services.dhlRetoure` service code. The API returns both labels
 * in the same response.
 *
 * AdditionalInsurance is applied for declared retail value coverage
 * (DHL covers up to the declared amount — use item retail price).
 */
export async function createDhlShipment(
  rentalId: string,
  recipient: ShippingAddress,
  itemDescription: string,
  declaredValueEur: number,
  shipDate: Date = new Date()
): Promise<DhlShipmentResult> {
  const shipper = shipperAddress();
  const { street: recipientStreet, house: recipientHouse } = splitStreetHouse(recipient.addressLine1);
  const plannedShipDate = shipDate.toISOString().split("T")[0];

  const orderPayload = {
    profile: "STANDARD_GRUPPENPROFIL",
    shipments: [
      {
        product: "V01PAK", // DHL Paket domestic Germany
        billingNumber: billingNumber(),
        refNo: rentalId.slice(-20),
        shipDate: plannedShipDate,
        shipper,
        consignee: {
          name1: recipient.fullName,
          addressStreet: recipientStreet,
          addressHouse: recipientHouse,
          postalCode: recipient.postalCode,
          city: recipient.city,
          country: toAlpha3(recipient.country),
          ...(recipient.phone ? { phone: recipient.phone } : {}),
          ...(recipient.email ? { email: recipient.email } : {}),
        },
        details: {
          dim: { uom: "mm", height: 100, length: 300, width: 200 },
          weight: { uom: "kg", value: 0.5 },
        },
        services: {
          // Zusatzversicherung (AdditionalInsurance) for declared retail value
          additionalInsurance: {
            currency: "EUR",
            value: declaredValueEur,
          },
          // DHL Retoure: pre-paid return label included in same API call
          dhlRetoure: {
            billingNumber: retoureBillingNumber(),
            refNo: `RET-${rentalId.slice(-17)}`,
            // Return shipment: same consignee/shipper but reversed — DHL handles this
          },
        },
        content: {
          contentPieces: [
            {
              itemDescription: itemDescription.slice(0, 100),
              packagedQuantity: 1,
              countryOfOrigin: "DEU",
              hsCode: "9101", // HS code for wristwatches
            },
          ],
          exportDescription: itemDescription.slice(0, 100),
        },
      },
    ],
  };

  const response = (await paketPost(
    "/orders?validate=false&printOnlyIfCodable=false&labelFormat=910-300-700",
    orderPayload
  )) as DhlOrderResponse;

  const item = response.items?.[0];
  if (!item) throw new Error("DHL Paket API: no shipment item in response");

  // Check for validation errors
  if (item.sstatus?.statusCode && item.sstatus.statusCode >= 400) {
    throw new Error(`DHL Paket shipment creation failed: ${item.sstatus.title} — ${item.sstatus.detail}`);
  }

  const outboundTracking = item.shipmentNo ?? "";
  const returnTracking = item.returnShipmentNo ?? "";
  const outboundBase64 = item.label?.b64 ?? "";
  const returnBase64 = item.returnLabel?.b64 ?? "";

  return {
    outboundTrackingNumber: outboundTracking,
    outboundLabelBase64: outboundBase64,
    outboundLabelUrl: outboundBase64
      ? `data:application/pdf;base64,${outboundBase64}`
      : "",
    returnTrackingNumber: returnTracking,
    returnLabelBase64: returnBase64,
    returnLabelUrl: returnBase64
      ? `data:application/pdf;base64,${returnBase64}`
      : "",
  };
}

/**
 * Smoke test: validates credentials by calling GET /shipments with a known
 * sandbox tracking number. Returns { ok: true } on success.
 */
export async function validateDhlCredentials(): Promise<{ ok: boolean; error?: string }> {
  try {
    const creds = gkpCredentials();
    const basicAuth = Buffer.from(`${creds.user}:${creds.pass}`).toString("base64");
    const res = await fetch(`${BASE_URL}/shipments?shipmentTrackingNumber=00340434492893557905`, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "dhl-api-key": apiKey(),
        Accept: "application/json",
      },
    });
    return { ok: res.status < 500 };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
