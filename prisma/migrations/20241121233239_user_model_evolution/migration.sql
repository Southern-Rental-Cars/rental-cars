/*
  Warnings:

  - You are about to drop the column `billing_country` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `billing_postal_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `street_address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "billing_country",
DROP COLUMN "billing_postal_code",
DROP COLUMN "date_of_birth",
DROP COLUMN "street_address",
DROP COLUMN "zip_code",
ADD COLUMN     "billing_zip_code" VARCHAR(10),
ADD COLUMN     "is_billing_complete" BOOLEAN DEFAULT false,
ADD COLUMN     "is_license_complete" BOOLEAN DEFAULT false,
ADD COLUMN     "license_date_of_birth" TIMESTAMP(3),
ADD COLUMN     "license_street_address" TEXT,
ADD COLUMN     "license_zip_code" VARCHAR(10);
