/*
  Warnings:

  - A unique constraint covering the columns `[branch_id,name,tier]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "categories_name_tier_key";

-- CreateIndex
CREATE UNIQUE INDEX "categories_branch_id_name_tier_key" ON "categories"("branch_id", "name", "tier");
