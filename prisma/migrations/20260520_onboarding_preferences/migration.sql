-- Migration: onboarding preferences + subscription-linked rentals

-- Enums
CREATE TYPE "WatchStyle" AS ENUM ('sports', 'dress', 'casual', 'mixed');
CREATE TYPE "OccasionFocus" AS ENUM ('business', 'social_events', 'everyday', 'special_occasions');
CREATE TYPE "CaseSizePreference" AS ENUM ('size_36_38', 'size_39_41', 'size_42_plus', 'no_preference');

-- UserPreferences table
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "watchStyle" "WatchStyle",
    "occasionFocus" "OccasionFocus",
    "caseSizePreference" "CaseSizePreference",
    "familiarBrands" TEXT[] NOT NULL DEFAULT '{}',
    "firstOccasion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Onboarding flag on User
ALTER TABLE "User" ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- Link Rental to Subscription
ALTER TABLE "Rental" ADD COLUMN "subscriptionId" TEXT;

ALTER TABLE "Rental" ADD CONSTRAINT "Rental_subscriptionId_fkey"
    FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Rental_subscriptionId_idx" ON "Rental"("subscriptionId");
