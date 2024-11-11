/*
  Warnings:

  - A unique constraint covering the columns `[extra_id,date]` on the table `extra_availability` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "extra_availability" DROP CONSTRAINT "extra_availability_extra_id_fkey";

-- AlterTable
ALTER TABLE "extra_availability" ADD COLUMN     "extrasId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "extra_availability_extra_id_date_key" ON "extra_availability"("extra_id", "date");

-- AddForeignKey
ALTER TABLE "extra_availability" ADD CONSTRAINT "extra_availability_extrasId_fkey" FOREIGN KEY ("extrasId") REFERENCES "extras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
