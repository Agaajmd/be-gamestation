-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('qris', 'gopay', 'ovo', 'dana', 'shopeepay', 'linkaja', 'bca', 'bri', 'bni', 'mandiri', 'permata', 'cimb', 'midtrans', 'xendit', 'doku');

-- CreateTable
CREATE TABLE "branch_payment_methods" (
    "id" BIGSERIAL NOT NULL,
    "branch_id" BIGINT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "account_number" VARCHAR(255),
    "account_name" VARCHAR(255),
    "qr_code_image" TEXT,
    "instructions" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "branch_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_branch_payment_methods_active" ON "branch_payment_methods"("branch_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "branch_payment_methods_branch_id_provider_key" ON "branch_payment_methods"("branch_id", "provider");

-- AddForeignKey
ALTER TABLE "branch_payment_methods" ADD CONSTRAINT "branch_payment_methods_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
