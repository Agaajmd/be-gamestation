/*
  Warnings:

  - You are about to drop the column `package_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the `device_packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packages` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `room_and_device_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "device_packages" DROP CONSTRAINT "device_packages_package_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_package_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_room_and_device_id_fkey";

-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_branch_id_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "package_id",
ALTER COLUMN "room_and_device_id" SET NOT NULL;

-- DropTable
DROP TABLE "device_packages";

-- DropTable
DROP TABLE "packages";

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_room_and_device_id_fkey" FOREIGN KEY ("room_and_device_id") REFERENCES "room_and_devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
