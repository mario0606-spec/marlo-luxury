-- AlterTable: add DHL Express tracking fields to Rental
ALTER TABLE "Rental" ADD COLUMN "dhlOutboundTrackingNumber" TEXT;
ALTER TABLE "Rental" ADD COLUMN "dhlOutboundLabelUrl" TEXT;
ALTER TABLE "Rental" ADD COLUMN "dhlReturnTrackingNumber" TEXT;
ALTER TABLE "Rental" ADD COLUMN "dhlReturnLabelUrl" TEXT;
ALTER TABLE "Rental" ADD COLUMN "dhlShipmentCreatedAt" TIMESTAMP(3);
