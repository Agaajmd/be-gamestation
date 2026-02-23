-- Fill null values first
UPDATE "branches" SET "address" = '' WHERE "address" IS NULL;
UPDATE "branches" SET "phone" = '' WHERE "phone" IS NULL;
UPDATE "branches" SET "open_time" = '09:00' WHERE "open_time" IS NULL;
UPDATE "branches" SET "close_time" = '22:00' WHERE "close_time" IS NULL;

-- AlterTable
ALTER TABLE "branches" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "open_time" TYPE VARCHAR(5),
ALTER COLUMN "open_time" SET NOT NULL,
ALTER COLUMN "close_time" TYPE VARCHAR(5),
ALTER COLUMN "close_time" SET NOT NULL;