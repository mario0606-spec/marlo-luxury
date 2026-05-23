import { WatchAuthenticity } from "./types";

const authenticityRecords: WatchAuthenticity[] = [
  {
    id: "auth-001",
    serial: "MAR-2024-PC-5196R-001",
    brand: "Patek Philippe",
    model: "Calatrava",
    referenceNumber: "5196R",
    watchmaker: "Thomas Engel, Uhrmachermeister",
    inspectionVideoUrl: null,
    nfcUid: null,
    conditionLog: [
      {
        date: "2024-11-15",
        grade: "A+",
        notes: "Erstinspektion. Gehäuse makellos, Werk Kaliber 215 PS läuft auf +1s/Tag. Originales Alligatorband.",
        inspectedBy: "Thomas Engel",
      },
    ],
    authenticatedAt: "2024-11-15T10:00:00Z",
    certificateNumber: "MARLO-CERT-2024-001",
  },
  {
    id: "auth-002",
    serial: "MAR-2024-RD-116500-001",
    brand: "Rolex",
    model: "Daytona",
    referenceNumber: "116500LN",
    watchmaker: "Thomas Engel, Uhrmachermeister",
    inspectionVideoUrl: null,
    nfcUid: null,
    conditionLog: [
      {
        date: "2024-12-01",
        grade: "A",
        notes: "Gehäuse mit minimalen Tragespuren am Bandanstoß. Werk Kaliber 4130 läuft auf +2s/Tag. Keramiklünette einwandfrei.",
        inspectedBy: "Thomas Engel",
      },
    ],
    authenticatedAt: "2024-12-01T14:00:00Z",
    certificateNumber: "MARLO-CERT-2024-002",
  },
  {
    id: "auth-003",
    serial: "MAR-2024-AP-15500-001",
    brand: "Audemars Piguet",
    model: "Royal Oak",
    referenceNumber: "15500ST",
    watchmaker: "Thomas Engel, Uhrmachermeister",
    inspectionVideoUrl: null,
    nfcUid: null,
    conditionLog: [
      {
        date: "2025-01-10",
        grade: "A+",
        notes: "Tapisserie-Zifferblatt perfekt. Werk Kaliber 4302 auf +1s/Tag. Stahlband ohne sichtbare Kratzer.",
        inspectedBy: "Thomas Engel",
      },
    ],
    authenticatedAt: "2025-01-10T09:00:00Z",
    certificateNumber: "MARLO-CERT-2025-001",
  },
];

export function getAuthenticityBySerial(
  serial: string,
): WatchAuthenticity | undefined {
  return authenticityRecords.find((r) => r.serial === serial);
}

export function getAuthenticityById(
  id: string,
): WatchAuthenticity | undefined {
  return authenticityRecords.find((r) => r.id === id);
}

export function getAllAuthenticityRecords(): WatchAuthenticity[] {
  return authenticityRecords;
}
