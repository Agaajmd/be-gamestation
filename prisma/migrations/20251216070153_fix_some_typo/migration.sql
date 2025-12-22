/*
  Warnings:

  - You are about to drop the `device_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "availability_exceptions" DROP CONSTRAINT "availability_exceptions_room_and_device_id_fkey";

-- DropForeignKey
ALTER TABLE "device_categories" DROP CONSTRAINT "device_categories_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "device_categories" DROP CONSTRAINT "device_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "game_availability" DROP CONSTRAINT "game_availability_room_and_device_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_room_and_device_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_room_and_device_id_fkey";

-- DropTable
DROP TABLE "device_categories";

-- CreateTable
CREATE TABLE "room_and_devices" (
    "id" BIGSERIAL NOT NULL,
    "branch_id" BIGINT NOT NULL,
    "category_id" BIGINT,
    "code" VARCHAR(32),
    "name" VARCHAR(50) NOT NULL,
    "tier" "CategoryTier" NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "version" "DeviceVersion",
    "price_per_hour" DECIMAL(12,2) NOT NULL,
    "room_number" VARCHAR(20),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "room_and_devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_device_category_branch_type" ON "room_and_devices"("category_id", "device_type");

-- CreateIndex
CREATE UNIQUE INDEX "room_and_devices_category_id_name_device_type_key" ON "room_and_devices"("category_id", "name", "device_type");

-- AddForeignKey
ALTER TABLE "room_and_devices" ADD CONSTRAINT "room_and_devices_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_and_devices" ADD CONSTRAINT "room_and_devices_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_availability" ADD CONSTRAINT "game_availability_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "room_and_devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "room_and_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "room_and_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "room_and_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
