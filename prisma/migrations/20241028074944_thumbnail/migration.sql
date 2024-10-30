/*
  Warnings:

  - Added the required column `thumbnail` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "thumbnail" TEXT NOT NULL;
