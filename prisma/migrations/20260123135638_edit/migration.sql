/*
  Warnings:

  - You are about to drop the column `order_id` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_id,branch_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_order_id_fkey";

-- DropIndex
DROP INDEX "reviews_order_id_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "order_id",
ADD COLUMN     "branch_id" BIGINT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_customer_id_branch_id_key" ON "reviews"("customer_id", "branch_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
