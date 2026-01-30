/*
  Warnings:

  - The primary key for the `FailedJob` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `FailedJob` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `entityId` on the `FailedJob` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FailedJob" DROP CONSTRAINT "FailedJob_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "entityId",
ADD COLUMN     "entityId" BIGINT NOT NULL,
ADD CONSTRAINT "FailedJob_pkey" PRIMARY KEY ("id");
