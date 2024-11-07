/*
  Warnings:

  - Made the column `user_id` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_price` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicle_id` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "total_price" SET NOT NULL,
ALTER COLUMN "vehicle_id" SET NOT NULL;
