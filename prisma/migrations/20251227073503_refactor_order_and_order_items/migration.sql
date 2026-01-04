/*
  Warnings:

  - You are about to drop the column `game_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `advance_booking_fee` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `base_amount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `booking_end` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `booking_start` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `category_fee` on the `orders` table. All the data in the column will be lost.
  - Added the required column `base_amount` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_end` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_start` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_game_id_fkey";

-- DropIndex
DROP INDEX "idx_orders_branch_booking";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "game_id",
ADD COLUMN     "advance_booking_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "base_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "booking_end" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "booking_start" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "category_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "gameId" BIGINT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "advance_booking_fee",
DROP COLUMN "base_amount",
DROP COLUMN "booking_end",
DROP COLUMN "booking_start",
DROP COLUMN "category_fee";

-- CreateIndex
CREATE INDEX "idx_orders_branch_booking" ON "orders"("branch_id");
