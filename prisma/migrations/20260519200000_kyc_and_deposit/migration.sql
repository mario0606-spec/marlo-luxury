-- CreateEnum: KycStatus
CREATE TYPE "KycStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum: ConditionPhase
CREATE TYPE "ConditionPhase" AS ENUM ('DISPATCH', 'RETURN');

-- CreateEnum: ConditionStatus
CREATE TYPE "ConditionStatus" AS ENUM ('PASS', 'DAMAGE_NOTED', 'FAIL');

-- AlterTable: User — add KYC fields
ALTER TABLE "User"
  ADD COLUMN "kycStatus"                    "KycStatus" NOT NULL DEFAULT 'UNVERIFIED',
  ADD COLUMN "kycSubmittedAt"               TIMESTAMP(3),
  ADD COLUMN "kycFullName"                  TEXT,
  ADD COLUMN "kycDateOfBirth"               TIMESTAMP(3),
  ADD COLUMN "kycDocumentType"              TEXT,
  ADD COLUMN "kycDocumentNumber"            TEXT,
  ADD COLUMN "stripeVerificationSessionId"  TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeVerificationSessionId_key" ON "User"("stripeVerificationSessionId");

-- AlterTable: Rental — add deposit hold and waiver fields
ALTER TABLE "Rental"
  ADD COLUMN "depositIntentId"       TEXT,
  ADD COLUMN "depositCaptured"       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "depositCaptureAmount"  INTEGER,
  ADD COLUMN "waiverPurchased"       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "waiverAmount"          INTEGER;

-- CreateTable: ConditionLog
CREATE TABLE "ConditionLog" (
    "id"        TEXT NOT NULL,
    "rentalId"  TEXT NOT NULL,
    "phase"     "ConditionPhase" NOT NULL,
    "photos"    TEXT[],
    "status"    "ConditionStatus" NOT NULL,
    "notes"     TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConditionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: ConditionLog unique per rental+phase
CREATE UNIQUE INDEX "ConditionLog_rentalId_phase_key" ON "ConditionLog"("rentalId", "phase");

-- CreateIndex: ConditionLog rentalId
CREATE INDEX "ConditionLog_rentalId_idx" ON "ConditionLog"("rentalId");

-- AddForeignKey: ConditionLog.rentalId → Rental.id
ALTER TABLE "ConditionLog" ADD CONSTRAINT "ConditionLog_rentalId_fkey"
  FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;
