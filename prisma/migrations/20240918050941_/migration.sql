/*
  Warnings:

  - You are about to drop the column `available` on the `extras` table. All the data in the column will be lost.
  - Made the column `available_quantity` on table `extras` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "extras" DROP COLUMN "available",
ALTER COLUMN "available_quantity" SET NOT NULL;
