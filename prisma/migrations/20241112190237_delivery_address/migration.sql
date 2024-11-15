/*
  Warnings:

  - You are about to drop the column `delivery_cost` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "delivery_cost",
ADD COLUMN     "delivery_address" VARCHAR(255);
