/*
  Warnings:

  - Added the required column `total_available` to the `extras` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "extras" ADD COLUMN     "total_available" INTEGER NOT NULL;
