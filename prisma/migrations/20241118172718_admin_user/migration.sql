/*
  Warnings:

  - You are about to drop the column `role_access` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "role_access",
ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Role";
