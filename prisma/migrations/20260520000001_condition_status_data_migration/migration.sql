-- Migrate existing ConditionLog rows to new enum values (must run after enum values are committed)
UPDATE "ConditionLog" SET "status" = 'PRISTINE' WHERE "status" = 'PASS';
UPDATE "ConditionLog" SET "status" = 'MINOR_WEAR' WHERE "status" = 'DAMAGE_NOTED';
UPDATE "ConditionLog" SET "status" = 'DAMAGE' WHERE "status" = 'FAIL';
