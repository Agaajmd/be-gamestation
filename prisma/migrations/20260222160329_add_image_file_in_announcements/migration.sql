/*
  Warnings:

  - You are about to drop the column `content` on the `announcements` table. All the data in the column will be lost.
  - Added the required column `description` to the `announcements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "content",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image_file" TEXT;

ALTER TABLE "announcements" ALTER COLUMN "description" DROP DEFAULT;