/*
  Warnings:

  - Made the column `address` on table `branches` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `branches` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `open_time` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `close_time` to the `branches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "branches" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
DROP COLUMN "open_time",
ADD COLUMN     "open_time" VARCHAR(5) NOT NULL,
DROP COLUMN "close_time",
ADD COLUMN     "close_time" VARCHAR(5) NOT NULL;
