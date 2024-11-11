-- AlterTable
ALTER TABLE "users" ADD COLUMN     "billing_city" VARCHAR(50),
ADD COLUMN     "billing_email" VARCHAR(100),
ADD COLUMN     "billing_full_name" VARCHAR(100),
ADD COLUMN     "billing_state" VARCHAR(50),
ADD COLUMN     "tax_id" VARCHAR(50);
