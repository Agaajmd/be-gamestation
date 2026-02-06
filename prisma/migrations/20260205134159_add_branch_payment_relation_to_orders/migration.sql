/*
  Warnings:

  - You are about to drop the column `payment_method` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "payment_method",
ADD COLUMN     "payment_id" BIGINT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "branch_payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
