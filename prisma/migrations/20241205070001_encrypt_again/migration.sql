/*
  Warnings:

  - You are about to alter the column `license_street_address` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(999)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "billing_city" SET DATA TYPE VARCHAR(999),
ALTER COLUMN "billing_state" SET DATA TYPE VARCHAR(999),
ALTER COLUMN "billing_zip_code" SET DATA TYPE VARCHAR(999),
ALTER COLUMN "license_street_address" SET DATA TYPE VARCHAR(999);
