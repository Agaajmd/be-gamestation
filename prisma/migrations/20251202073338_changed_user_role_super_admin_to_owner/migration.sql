/*
  Warnings:

  - The values [super_admin] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- Step 1: Update existing super_admin values to owner temporarily
UPDATE "users" SET "role" = 'admin' WHERE "role" = 'super_admin';

-- Step 2: AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('customer', 'admin', 'owner');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- Step 3: Update the temporarily changed values to owner
UPDATE "users" SET "role" = 'owner' WHERE "role" = 'admin' AND id IN (SELECT "user_id" FROM "owners");
