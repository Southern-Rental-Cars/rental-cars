/*
  Warnings:

  - You are about to drop the column `extras` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `long_description` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `turo_url` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `billing_email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `billing_full_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `license_city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license_country` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cars" DROP COLUMN "extras",
DROP COLUMN "long_description",
DROP COLUMN "turo_url";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "billing_email",
DROP COLUMN "billing_full_name",
ADD COLUMN     "license_city" VARCHAR(25) NOT NULL,
ADD COLUMN     "license_country" VARCHAR(25) NOT NULL;

-- CreateTable
CREATE TABLE "_VehicleExtras" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VehicleExtras_AB_unique" ON "_VehicleExtras"("A", "B");

-- CreateIndex
CREATE INDEX "_VehicleExtras_B_index" ON "_VehicleExtras"("B");

-- AddForeignKey
ALTER TABLE "_VehicleExtras" ADD CONSTRAINT "_VehicleExtras_A_fkey" FOREIGN KEY ("A") REFERENCES "extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VehicleExtras" ADD CONSTRAINT "_VehicleExtras_B_fkey" FOREIGN KEY ("B") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
