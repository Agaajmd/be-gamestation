/*
  Warnings:

  - You are about to drop the column `code` on the `room_and_devices` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `room_and_devices` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoomAndDeviceStatus" AS ENUM ('available', 'maintenance', 'in_use');

-- AlterTable
ALTER TABLE "room_and_devices" DROP COLUMN "code",
DROP COLUMN "is_active",
ADD COLUMN     "status" "RoomAndDeviceStatus" NOT NULL DEFAULT 'available';

-- DropEnum
DROP TYPE "DeviceStatus";
