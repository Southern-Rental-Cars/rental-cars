/*
  Warnings:

  - You are about to drop the column `car_id` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `car_name` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `car_id` on the `car_images` table. All the data in the column will be lost.
  - You are about to drop the column `car_name` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_payment_method_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_car_id_fkey";

-- DropForeignKey
ALTER TABLE "car_images" DROP CONSTRAINT "car_images_car_id_fkey";

-- DropIndex
DROP INDEX "users_stripe_customer_id_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "car_id",
DROP COLUMN "car_name",
ADD COLUMN     "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payer_email" VARCHAR(100),
ADD COLUMN     "payment_provider" VARCHAR(50) DEFAULT 'paypal',
ADD COLUMN     "payment_status" VARCHAR(20) DEFAULT 'pending',
ADD COLUMN     "paypal_order_id" VARCHAR(100),
ADD COLUMN     "paypal_transaction_id" VARCHAR(100),
ADD COLUMN     "vehicle_id" INTEGER,
ADD COLUMN     "vehicle_name" TEXT;

-- AlterTable
ALTER TABLE "car_images" DROP COLUMN "car_id",
ADD COLUMN     "vehicle_id" INTEGER;

-- AlterTable
ALTER TABLE "cars" DROP COLUMN "car_name",
ADD COLUMN     "name" VARCHAR(100);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_payment_method_id",
ADD COLUMN     "paypal_billing_agreement_id" VARCHAR(100),
ADD COLUMN     "paypal_payer_id" VARCHAR(100),
ADD COLUMN     "paypal_payment_token" VARCHAR(100);

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
