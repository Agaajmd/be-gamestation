-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_proof_uploaded_at" TIMESTAMP(6),
ADD COLUMN     "payment_proof_url" TEXT;
