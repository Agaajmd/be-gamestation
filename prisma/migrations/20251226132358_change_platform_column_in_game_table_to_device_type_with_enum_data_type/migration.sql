/*
  Warnings:

  - You are about to drop the column `platform` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "platform",
ADD COLUMN     "deviceType" "DeviceType";

-- DropEnum
DROP TYPE "Platform";
