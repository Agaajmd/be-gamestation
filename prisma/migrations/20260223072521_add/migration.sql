/*
  Warnings:

  - You are about to alter the column `open_time` on the `branches` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `VarChar(5)`.
  - You are about to alter the column `close_time` on the `branches` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `VarChar(5)`.
  - Added the required column `priority` to the `announcements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnnouncementPriority" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN "priority" "AnnouncementPriority" NOT NULL DEFAULT 'medium';

