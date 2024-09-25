/*
  Warnings:

  - You are about to drop the column `total_available` on the `extras` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `extras` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to drop the `extra_availability` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `booking_id` on table `booking_extras` required. This step will fail if there are existing NULL values in that column.
  - Made the column `extra_id` on table `booking_extras` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `booking_extras` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `total_quantity` to the `extras` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "extra_availability" DROP CONSTRAINT "extra_availability_extra_id_fkey";

-- AlterTable
ALTER TABLE "booking_extras" ALTER COLUMN "booking_id" SET NOT NULL,
ALTER COLUMN "extra_id" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL;

-- AlterTable
ALTER TABLE "extras" DROP COLUMN "total_available",
ADD COLUMN     "total_quantity" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "extra_availability";
