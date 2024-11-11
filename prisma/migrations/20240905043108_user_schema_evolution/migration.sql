/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license_back_img` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license_expiration` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license_front_img` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license_number` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license_state` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "access_role" VARCHAR(10) NOT NULL,
ADD COLUMN     "billing_country" VARCHAR(3),
ADD COLUMN     "billing_postal_code" VARCHAR(10),
ADD COLUMN     "billing_street_address" TEXT,
ADD COLUMN     "country" VARCHAR(3) NOT NULL,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "license_back_img" TEXT NOT NULL,
ADD COLUMN     "license_expiration" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "license_front_img" TEXT NOT NULL,
ADD COLUMN     "license_number" VARCHAR(25) NOT NULL,
ADD COLUMN     "license_state" VARCHAR(25) NOT NULL,
ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "street_address" TEXT,
ADD COLUMN     "stripe_customer_id" VARCHAR(100),
ADD COLUMN     "stripe_payment_method_id" VARCHAR(100),
ADD COLUMN     "updated_at" TIMESTAMP(6);

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");
