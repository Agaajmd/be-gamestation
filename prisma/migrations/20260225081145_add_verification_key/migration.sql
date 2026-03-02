/*
  Warnings:

  - You are about to alter the column `open_time` on the `branches` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `VarChar(5)`.
  - You are about to alter the column `close_time` on the `branches` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE "branches" ALTER COLUMN "open_time" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "close_time" SET DATA TYPE VARCHAR(5);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verification_key" VARCHAR(96);
