/*
  Warnings:

  - The values [paid,checked_in,refunded] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `days_in_advance` on the `advance_booking_prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[branch_id,min_days,max_days]` on the table `advance_booking_prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `max_days` to the `advance_booking_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_days` to the `advance_booking_prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('cart', 'pending', 'confirmed', 'completed', 'cancelled');
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "advance_booking_prices_branch_id_days_in_advance_key";

-- AlterTable
ALTER TABLE "advance_booking_prices" DROP COLUMN "days_in_advance",
ADD COLUMN     "max_days" INTEGER NOT NULL,
ADD COLUMN     "min_days" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "advance_booking_prices_branch_id_min_days_max_days_key" ON "advance_booking_prices"("branch_id", "min_days", "max_days");
