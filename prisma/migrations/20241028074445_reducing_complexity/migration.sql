/*
  Warnings:

  - You are about to drop the `license_images` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `vehicle_id` on table `car_images` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "car_images" DROP CONSTRAINT "car_images_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "license_images" DROP CONSTRAINT "license_images_user_id_fkey";

-- AlterTable
ALTER TABLE "car_images" ALTER COLUMN "vehicle_id" SET NOT NULL;

-- DropTable
DROP TABLE "license_images";

-- DropEnum
DROP TYPE "license_side";
