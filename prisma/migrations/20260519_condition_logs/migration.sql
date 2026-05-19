-- AlterEnum — add DISPATCHED to RentalStatus
ALTER TYPE "RentalStatus" ADD VALUE 'DISPATCHED';

-- CreateEnum
CREATE TYPE "ConditionLogType" AS ENUM ('DISPATCH', 'RETURN');

-- CreateEnum
CREATE TYPE "ConditionAssessment" AS ENUM ('PRISTINE', 'MINOR_WEAR', 'DAMAGE', 'MISSING_ITEM');

-- CreateTable
CREATE TABLE "ConditionLog" (
    "id" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,
    "type" "ConditionLogType" NOT NULL,
    "photos" TEXT[],
    "notes" TEXT,
    "assessment" "ConditionAssessment",
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capturedBy" TEXT NOT NULL,

    CONSTRAINT "ConditionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConditionLog_rentalId_type_key" ON "ConditionLog"("rentalId", "type");

-- CreateIndex
CREATE INDEX "ConditionLog_rentalId_idx" ON "ConditionLog"("rentalId");

-- AddForeignKey
ALTER TABLE "ConditionLog" ADD CONSTRAINT "ConditionLog_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;
