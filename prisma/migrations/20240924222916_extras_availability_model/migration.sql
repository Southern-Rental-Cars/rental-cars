/*
  Warnings:

  - You are about to drop the column `available_quantity` on the `extras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "extras" DROP COLUMN "available_quantity";

-- CreateTable
CREATE TABLE "extra_availability" (
    "id" SERIAL NOT NULL,
    "extra_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "available_count" INTEGER NOT NULL,

    CONSTRAINT "extra_availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "extra_availability" ADD CONSTRAINT "extra_availability_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "extras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
