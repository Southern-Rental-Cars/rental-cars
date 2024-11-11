/*
  Warnings:

  - You are about to drop the column `payer_email` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "payer_email",
DROP COLUMN "payment_status";
