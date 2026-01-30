-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_sent_at" TIMESTAMP(3),
ADD COLUMN     "verification_token" VARCHAR(255),
ADD COLUMN     "verification_token_expires" TIMESTAMP(3);
