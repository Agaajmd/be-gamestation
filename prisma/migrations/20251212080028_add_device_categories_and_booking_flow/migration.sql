/*
  Warnings:

  - A unique constraint covering the columns `[branch_id,room_number]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price_per_hour` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_number` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_amount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceVersion" AS ENUM ('ps4', 'ps5', 'racing_standard', 'racing_pro', 'vr_meta', 'vr_pico', 'pc_standard', 'pc_gaming', 'arcade_standard');

-- CreateEnum
CREATE TYPE "CategoryTier" AS ENUM ('regular', 'vip', 'vvip');

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "category_id" BIGINT,
ADD COLUMN     "price_per_hour" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "room_number" VARCHAR(20) NOT NULL,
ADD COLUMN     "version" "DeviceVersion";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "advance_booking_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "base_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "category_fee" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "device_categories" (
    "id" BIGSERIAL NOT NULL,
    "branch_id" BIGINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "tier" "CategoryTier" NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "description" TEXT,
    "price_per_hour" DECIMAL(12,2) NOT NULL,
    "amenities" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "device_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advance_booking_prices" (
    "id" BIGSERIAL NOT NULL,
    "branch_id" BIGINT NOT NULL,
    "days_in_advance" INTEGER NOT NULL,
    "additional_fee" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advance_booking_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_availability" (
    "id" BIGSERIAL NOT NULL,
    "game_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_device_category_branch_type" ON "device_categories"("branch_id", "device_type");

-- CreateIndex
CREATE UNIQUE INDEX "device_categories_branch_id_name_device_type_key" ON "device_categories"("branch_id", "name", "device_type");

-- CreateIndex
CREATE UNIQUE INDEX "advance_booking_prices_branch_id_days_in_advance_key" ON "advance_booking_prices"("branch_id", "days_in_advance");

-- CreateIndex
CREATE UNIQUE INDEX "game_availability_game_id_category_id_key" ON "game_availability"("game_id", "category_id");

-- CreateIndex
CREATE INDEX "idx_device_branch_type_status" ON "devices"("branch_id", "type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "devices_branch_id_room_number_key" ON "devices"("branch_id", "room_number");

-- AddForeignKey
ALTER TABLE "device_categories" ADD CONSTRAINT "device_categories_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_booking_prices" ADD CONSTRAINT "advance_booking_prices_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "device_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_availability" ADD CONSTRAINT "game_availability_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_availability" ADD CONSTRAINT "game_availability_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "device_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
