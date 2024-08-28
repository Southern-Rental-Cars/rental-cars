/*
  Warnings:

  - The `faqs` column on the `cars` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cars" DROP COLUMN "faqs",
ADD COLUMN     "faqs" JSONB;
