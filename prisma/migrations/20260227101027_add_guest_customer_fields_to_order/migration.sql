-- Add guest customer fields to orders table for walk-in customers without accounts
ALTER TABLE "orders" 
  ALTER COLUMN "customer_id" DROP NOT NULL,
  ADD COLUMN "guest_customer_name" VARCHAR(100),
  ADD COLUMN "guest_customer_phone" VARCHAR(20),
  ADD COLUMN "guest_customer_email" VARCHAR(255);

-- Add constraint to ensure either customerId OR guest fields are populated
-- Note: This check constraint might need to be adjusted based on your DB version
ALTER TABLE "orders"
  ADD CONSTRAINT "check_customer_source" 
  CHECK (
    (customer_id IS NOT NULL AND guest_customer_name IS NULL AND guest_customer_phone IS NULL) OR
    (customer_id IS NULL AND guest_customer_name IS NOT NULL AND guest_customer_phone IS NOT NULL)
  );
