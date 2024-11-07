/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires_at` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- DropIndex
DROP INDEX "VerificationToken_token_expiresAt_idx";

-- DropIndex
DROP INDEX "VerificationToken_userId_key";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_user_id_key" ON "VerificationToken"("user_id");

-- CreateIndex
CREATE INDEX "VerificationToken_token_expires_at_idx" ON "VerificationToken"("token", "expires_at");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
