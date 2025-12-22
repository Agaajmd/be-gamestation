/*
  Warnings:

  - You are about to drop the column `device_id` on the `availability_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `amenities` on the `device_categories` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `device_categories` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `game_availability` table. All the data in the column will be lost.
  - You are about to drop the column `device_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `device_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the `devices` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[category_id,name,device_type]` on the table `device_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[game_id,room_and_device_id]` on the table `game_availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room_and_device_id` to the `availability_exceptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_and_device_id` to the `game_availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_and_device_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "availability_exceptions" DROP CONSTRAINT "availability_exceptions_device_id_fkey";

-- DropForeignKey
ALTER TABLE "device_categories" DROP CONSTRAINT "device_categories_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_category_id_fkey";

-- DropForeignKey
ALTER TABLE "game_availability" DROP CONSTRAINT "game_availability_category_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_device_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_device_id_fkey";

-- DropIndex
DROP INDEX "device_categories_branch_id_name_device_type_key";

-- DropIndex
DROP INDEX "idx_device_category_branch_type";

-- DropIndex
DROP INDEX "game_availability_game_id_category_id_key";

-- AlterTable
ALTER TABLE "availability_exceptions" DROP COLUMN "device_id",
ADD COLUMN     "room_and_device_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "device_categories" DROP COLUMN "amenities",
DROP COLUMN "description",
ADD COLUMN     "category_id" BIGINT,
ADD COLUMN     "code" VARCHAR(32),
ADD COLUMN     "room_number" VARCHAR(20),
ADD COLUMN     "version" "DeviceVersion";

-- AlterTable
ALTER TABLE "game_availability" DROP COLUMN "category_id",
ADD COLUMN     "room_and_device_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "device_id",
ADD COLUMN     "room_and_device_id" BIGINT;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "device_id",
ADD COLUMN     "room_and_device_id" BIGINT NOT NULL;

-- DropTable
DROP TABLE "devices";

-- CreateTable
CREATE TABLE "categories" (
    "id" BIGSERIAL NOT NULL,
    "branch_id" BIGINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "tier" "CategoryTier" NOT NULL,
    "price_per_hour" DECIMAL(12,2) NOT NULL,
    "amenities" JSONB DEFAULT '[]',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_tier_key" ON "categories"("name", "tier");

-- CreateIndex
CREATE INDEX "idx_device_category_branch_type" ON "device_categories"("category_id", "device_type");

-- CreateIndex
CREATE UNIQUE INDEX "device_categories_category_id_name_device_type_key" ON "device_categories"("category_id", "name", "device_type");

-- CreateIndex
CREATE UNIQUE INDEX "game_availability_game_id_room_and_device_id_key" ON "game_availability"("game_id", "room_and_device_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_categories" ADD CONSTRAINT "device_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_categories" ADD CONSTRAINT "device_categories_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_availability" ADD CONSTRAINT "game_availability_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "device_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "device_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "device_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "device_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
