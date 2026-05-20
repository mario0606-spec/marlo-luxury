/**
 * DHL Express — MyDHL API integration
 *
 * Docs: https://developer.dhl.com/api-reference/dhl-express-mydhl-api
 *
 * Required env vars:
 *   DHL_API_KEY      — DHL Express API key (Business Customer Portal)
 *   DHL_API_SECRET   — DHL Express API secret
 *   DHL_ACCOUNT_NUMBER — DHL Express account number (10 digits)
 *   DHL_SANDBOX      — set to "true" for sandbox/test mode
 *
 * Sender details (company shipper):
 *   DHL_SHIPPER_NAME
 *   DHL_SHIPPER_COMPANY
 *   DHL_SHIPPER_ADDRESS1
 *   DHL_SHIPPER_CITY
 *   DHL_SHIPPER_POSTAL_CODE
 *   DHL_SHIPPER_COUNTRY_CODE  (e.g. "DE")
 *   DHL_SHIPPER_PHONE
 *   DHL_SHIPPER_EMAIL
 */

const BASE_URL_PROD = "https://express.api.dhl.com/mydhlapi";
const BASE_URL_SANDBOX = "https://express.api.dhl.com/mydhlapi/test";

function baseUrl(): string {
  return process.env.DHL_SANDBOX === "true" ? BASE_URL_SANDBOX : BASE_URL_PROD;
}

function authHeader(): string {
  const key = process.env.DHL_API_KEY;
  const secret = process.env.DHL_API_SECRET;
  if (!key || !secret) {
    throw new Error("DHL_API_KEY and DHL_API_SECRET must be set");
  }
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

function accountNumber(): string {
  const acct = process.env.DHL_ACCOUNT_NUMBER;
  if (!acct) throw new Error("DHL_ACCOUNT_NUMBER must be set");
  return acct;
}

function shipperContact() {
  return {
    fullName: process.env.DHL_SHIPPER_NAME ?? "Marlo Luxury Rentals",
    companyName: process.env.DHL_SHIPPER_COMPANY ?? "Marlo Luxury Rentals GmbH",
    phone: process.env.DHL_SHIPPER_PHONE ?? "+49000000000",
    email: process.env.DHL_SHIPPER_EMAIL ?? "versand@marloluxury.com",
  };
}

function shipperAddress() {
  return {
    addressLine1: process.env.DHL_SHIPPER_ADDRESS1 ?? "",
    cityName: process.env.DHL_SHIPPER_CITY ?? "",
    postalCode: process.env.DHL_SHIPPER_POSTAL_CODE ?? "",
    countryCode: process.env.DHL_SHIPPER_COUNTRY_CODE ?? "DE",
  };
}

async function dhlPost(path: string, body: unknown): Promise<unknown> {
  const url = `${baseUrl()}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
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
    const detail = typeof json === "object" && json !== null
      ? JSON.stringify((json as Record<string, unknown>).detail ?? json)
      : text;
    throw new Error(`DHL API error ${res.status}: ${detail}`);
  }

  return json;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2
  phone?: string;
  email?: string;
}

export interface DhlShipmentResult {
  outboundTrackingNumber: string;
  outboundLabelUrl: string;        // base64-encoded PDF data URL or direct URL
  outboundLabelBase64: string;     // raw base64 for storage/email
  returnTrackingNumber: string;
  returnLabelUrl: string;
  returnLabelBase64: string;
}

interface DhlShipmentResponse {
  shipmentTrackingNumber?: string;
  cancelPickupUrl?: string;
  trackingUrl?: string;
  packages?: Array<{
    referenceNumber?: string;
    trackingNumber?: string;
    documents?: Array<{
      imageFormat: string;
      content: string;
      typeCode: string;
    }>;
  }>;
  documents?: Array<{
    imageFormat: string;
    content: string;
    typeCode: string;
  }>;
}

function extractLabel(response: DhlShipmentResponse): { trackingNumber: string; labelBase64: string } {
  const tracking =
    response.packages?.[0]?.trackingNumber ??
    response.shipmentTrackingNumber ??
    "";

  // MyDHL API returns documents at package or root level
  const docs =
    response.packages?.[0]?.documents ??
    response.documents ??
    [];

  const labelDoc = docs.find((d) => d.typeCode === "label" || d.typeCode === "waybill");
  const labelBase64 = labelDoc?.content ?? "";

  return { trackingNumber: tracking, labelBase64 };
}

/**
 * Create outbound DHL Express shipment + Retoure return label in one call.
 *
 * We create two separate MyDHL shipments:
 *   1. Outbound: Marlo → Customer (product delivery)
 *   2. Return:   Customer → Marlo  (Retoure product; label included in box)
 *
 * DHL Premium declared value insurance is requested on both legs via
 * the `declaredValue` and `declaredValueCurrency` fields.
 */
export async function createDhlShipment(
  rentalId: string,
  recipient: ShippingAddress,
  itemDescription: string,
  declaredValueEur: number, // retail value of the item in EUR (for DHL Premium insurance)
  shipDate: Date = new Date()
): Promise<DhlShipmentResult> {
  const plannedShipDate = formatDhlDate(shipDate);
  const shipper = shipperContact();
  const shipperAddr = shipperAddress();

  // ─── Outbound shipment (Marlo → Customer) ───────────────────────────────
  const outboundPayload = {
    plannedShippingDateAndTime: `${plannedShipDate}T10:00:00 GMT+01:00`,
    pickup: { isRequested: false },
    productCode: "P", // DHL Express Worldwide
    localProductCode: "V", // DHL Paket (DACH express delivery)
    getRateEstimates: false,
    accounts: [{ typeCode: "shipper", number: accountNumber() }],
    valueAddedServices: [
      { serviceCode: "II", value: declaredValueEur, currency: "EUR" }, // DHL Premium declared value insurance
    ],
    outputImageProperties: {
      printerDPI: 300,
      customerBarcodes: [{ content: rentalId, symbologyCode: "93", textBelowBarcode: rentalId.slice(0, 20) }],
      imageOptions: [
        { typeCode: "label", templateName: "ECOM26_84_001", isRequested: true, invoiceType: "commercial", languageCode: "de" },
      ],
    },
    customerDetails: {
      shipperDetails: {
        postalAddress: { ...shipperAddr },
        contactInformation: { ...shipper },
        typeCode: "business",
      },
      receiverDetails: {
        postalAddress: {
          addressLine1: recipient.addressLine1,
          addressLine2: recipient.addressLine2,
          cityName: recipient.city,
          postalCode: recipient.postalCode,
          countryCode: recipient.country,
        },
        contactInformation: {
          fullName: recipient.fullName,
          phone: recipient.phone ?? "+49000000000",
          email: recipient.email ?? "",
        },
        typeCode: "private",
      },
    },
    content: {
      packages: [
        {
          weight: 0.5, // luxury watches are light; admin can override
          dimensions: { length: 30, width: 20, height: 10 },
          description: itemDescription.slice(0, 70),
          customerReferences: [{ value: rentalId, typeCode: "CU" }],
        },
      ],
      isCustomsDeclarable: false,
      description: itemDescription.slice(0, 70),
      incoterm: "DAP",
      unitOfMeasurement: "metric",
      declaredValue: declaredValueEur,
      declaredValueCurrency: "EUR",
    },
  };

  const outboundResponse = (await dhlPost("/shipments", outboundPayload)) as DhlShipmentResponse;
  const outbound = extractLabel(outboundResponse);

  // ─── Return (Retoure) shipment (Customer → Marlo) ────────────────────────
  // DHL Retoure Online: product code "PIDI" or use reverse-shipment endpoint.
  // We use the standard shipment endpoint with shipper/receiver swapped.
  const returnPayload = {
    plannedShippingDateAndTime: `${plannedShipDate}T10:00:00 GMT+01:00`,
    pickup: { isRequested: false },
    productCode: "P",
    localProductCode: "V",
    getRateEstimates: false,
    accounts: [{ typeCode: "shipper", number: accountNumber() }],
    valueAddedServices: [
      { serviceCode: "II", value: declaredValueEur, currency: "EUR" },
    ],
    outputImageProperties: {
      printerDPI: 300,
      imageOptions: [
        { typeCode: "label", templateName: "ECOM26_84_001", isRequested: true, invoiceType: "commercial", languageCode: "de" },
      ],
    },
    customerDetails: {
      // For return: customer is the shipper, Marlo is the receiver
      shipperDetails: {
        postalAddress: {
          addressLine1: recipient.addressLine1,
          addressLine2: recipient.addressLine2,
          cityName: recipient.city,
          postalCode: recipient.postalCode,
          countryCode: recipient.country,
        },
        contactInformation: {
          fullName: recipient.fullName,
          phone: recipient.phone ?? "+49000000000",
          email: recipient.email ?? "",
        },
        typeCode: "private",
      },
      receiverDetails: {
        postalAddress: { ...shipperAddr },
        contactInformation: { ...shipper },
        typeCode: "business",
      },
    },
    content: {
      packages: [
        {
          weight: 0.5,
          dimensions: { length: 30, width: 20, height: 10 },
          description: `RETURN - ${itemDescription.slice(0, 60)}`,
          customerReferences: [{ value: `RET-${rentalId}`, typeCode: "CU" }],
        },
      ],
      isCustomsDeclarable: false,
      description: `RETURN - ${itemDescription.slice(0, 60)}`,
      incoterm: "DAP",
      unitOfMeasurement: "metric",
      declaredValue: declaredValueEur,
      declaredValueCurrency: "EUR",
    },
  };

  const returnResponse = (await dhlPost("/shipments", returnPayload)) as DhlShipmentResponse;
  const ret = extractLabel(returnResponse);

  return {
    outboundTrackingNumber: outbound.trackingNumber,
    outboundLabelBase64: outbound.labelBase64,
    outboundLabelUrl: `data:application/pdf;base64,${outbound.labelBase64}`,
    returnTrackingNumber: ret.trackingNumber,
    returnLabelBase64: ret.labelBase64,
    returnLabelUrl: `data:application/pdf;base64,${ret.labelBase64}`,
  };
}

function formatDhlDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Lightweight sandbox smoke: calls the MyDHL rates endpoint to validate credentials.
 * Returns true if credentials are working.
 */
export async function validateDhlCredentials(): Promise<{ ok: boolean; error?: string }> {
  try {
    const url = `${baseUrl()}/rates?accountNumber=${accountNumber()}&originCountryCode=DE&originPostalCode=10115&destinationCountryCode=DE&destinationPostalCode=80331&weight=0.5&length=20&width=15&height=10&plannedShippingDateAndTime=${formatDhlDate(new Date())}T10:00:00+01:00&isCustomsDeclarable=false&unitOfMeasurement=metric`;
    const res = await fetch(url, {
      headers: { Authorization: authHeader(), Accept: "application/json" },
    });
    return { ok: res.ok };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
