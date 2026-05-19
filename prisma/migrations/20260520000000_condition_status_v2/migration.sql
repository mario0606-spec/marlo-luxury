-- Add new ConditionStatus enum values (each ADD VALUE commits implicitly before the next statement)
ALTER TYPE "ConditionStatus" ADD VALUE IF NOT EXISTS 'PRISTINE';
ALTER TYPE "ConditionStatus" ADD VALUE IF NOT EXISTS 'MINOR_WEAR';
ALTER TYPE "ConditionStatus" ADD VALUE IF NOT EXISTS 'DAMAGE';
ALTER TYPE "ConditionStatus" ADD VALUE IF NOT EXISTS 'MISSING_ITEM';
