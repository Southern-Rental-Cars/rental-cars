/*
  Warnings:

  - The `role_access` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'admin');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role_access",
ADD COLUMN     "role_access" "Role" NOT NULL DEFAULT 'customer';
