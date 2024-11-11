/*
  Warnings:

  - You are about to drop the column `extrasId` on the `extra_availability` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "extra_availability" DROP CONSTRAINT "extra_availability_extrasId_fkey";

-- AlterTable
ALTER TABLE "extra_availability" DROP COLUMN "extrasId";

-- AddForeignKey
ALTER TABLE "extra_availability" ADD CONSTRAINT "extra_availability_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "extras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
