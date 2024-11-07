/*
  Warnings:

  - You are about to drop the column `tax_id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "tax_id",
ALTER COLUMN "license_back_img" DROP NOT NULL,
ALTER COLUMN "license_expiration" DROP NOT NULL,
ALTER COLUMN "license_front_img" DROP NOT NULL,
ALTER COLUMN "license_number" DROP NOT NULL,
ALTER COLUMN "license_state" DROP NOT NULL,
ALTER COLUMN "license_city" DROP NOT NULL,
ALTER COLUMN "license_country" DROP NOT NULL;
