/*
  Warnings:

  - You are about to drop the column `access_role` on the `users` table. All the data in the column will be lost.
  - Added the required column `role_access` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "access_role",
ADD COLUMN     "role_access" VARCHAR(10) NOT NULL,
ADD COLUMN     "zip_code" VARCHAR(10);
